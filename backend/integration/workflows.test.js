const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const http = require("node:http");
const test = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = require("../src/app");
const User = require("../src/models/User");
const Patient = require("../src/models/Patient");
const Doctor = require("../src/models/Doctor");
const Case = require("../src/models/Case");
const Specimen = require("../src/models/Specimen");
const Block = require("../src/models/Block");
const Slide = require("../src/models/Slide");
const WorkflowEvent = require("../src/models/WorkflowEvent");
const QCRecord = require("../src/models/QCRecord");
const Report = require("../src/models/Report");
const Notification = require("../src/models/Notification");
const AuditLog = require("../src/models/AuditLog");

const models = [
  AuditLog,
  Notification,
  Report,
  QCRecord,
  WorkflowEvent,
  Slide,
  Block,
  Specimen,
  Case,
  Patient,
  Doctor,
  User,
];
const password = "Disposable-Test-Only-92!";
const runId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
const email = (role) => `${role}.${runId}@example.invalid`;
const phone = (digit) => `+91${digit}${crypto.randomInt(100000000, 999999999)}`;
const ownedIds = new Map(models.map((Model) => [Model, []]));
let server;
let baseUrl;

const remember = (Model, document) => {
  ownedIds.get(Model).push(document._id || document.id);
  return document;
};

const request = async (path, { method = "GET", token, body } = {}) => {
  const requestMethod = method.toUpperCase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  console.error(`[E2E request] START ${requestMethod} ${path}`);

  try {
    let response;

    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        signal: controller.signal,
        headers: {
          ...(token ? { authorization: `Bearer ${token}` } : {}),
          ...(body ? { "content-type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch (error) {
      throw new Error(
        `E2E request ${requestMethod} ${path} failed: ${error.name}: ${error.message}`,
        { cause: error }
      );
    }

    console.error(
      `[E2E request] HEADERS ${requestMethod} ${path} -> ${response.status}`
    );

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        `E2E response body ${requestMethod} ${path} failed: ${error.name}: ${error.message}`,
        { cause: error }
      );
    }

    console.error(`[E2E request] BODY DONE ${requestMethod} ${path}`);
    return { status: response.status, data };
  } finally {
    clearTimeout(timeout);
  }
};

const expectStatus = async (promise, status) => {
  const result = await promise;
  assert.equal(result.status, status, JSON.stringify(result.data));
  return result.data;
};

const internalLogin = async (identifier) => {
  const result = await expectStatus(
    request("/auth/login", { method: "POST", body: { identifier, password } }),
    200
  );
  return result.token;
};

const doctorLogin = async (identifier) => {
  const result = await expectStatus(
    request("/external-auth/doctor/login", { method: "POST", body: { identifier, password } }),
    200
  );
  return result.token;
};

const patientLogin = async (identifier) => {
  const result = await expectStatus(
    request("/external-auth/patient/login", { method: "POST", body: { identifier, password } }),
    200
  );
  return result.token;
};

test("isolated Mongo E2E: approvals, role access, laboratory workflow, QC and report sign-out", {
  skip: process.env.RUN_MONGO_INTEGRATION !== "true" ? "requires explicit dedicated test database opt-in" : false,
}, async (t) => {
  assert.equal(mongoose.connection.readyState, 0, "integration process must start without an existing Mongoose connection");
  await mongoose.connect(process.env.MONGO_TEST_URI, { serverSelectionTimeoutMS: 5000 });
  assert.equal(mongoose.connection.name, "pathology_laboratory_test");

  // Never seed over prior records. Refuse any non-empty test database; cleanup is exact-ID only.
  const existingCounts = await Promise.all(models.map((Model) => Model.countDocuments()));
  assert.deepEqual(existingCounts, existingCounts.map(() => 0), "test database is not empty; refusing to seed or modify existing records");

  // Randomized identifiers provide an additional collision guard before creating fixtures.
  const fixtureEmails = [email("admin"), email("tech"), email("pathologist"), email("doctor-a"), email("doctor-b"), email("patient-a"), email("patient-b")];
  const [existingUser, existingPatient, existingDoctor, existingCase] = await Promise.all([
    User.findOne({ email: { $in: fixtureEmails } }).lean(),
    Patient.findOne({ email: { $in: [email("patient-a"), email("patient-b")] } }).lean(),
    Doctor.findOne({ email: { $in: [email("doctor-a"), email("doctor-b")] } }).lean(),
    Case.findOne({ caseId: { $in: [`E2E-${runId}-A`, `E2E-${runId}-B`] } }).lean(),
  ]);
  assert.equal(existingUser || existingPatient || existingDoctor || existingCase, null, "randomized fixture identifiers already exist; refusing to seed");

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = remember(User, await User.create({
    name: "Disposable E2E Administrator",
    email: email("admin"),
    password: hashedPassword,
    phone: phone("9"),
    department: "Test Laboratory",
    role: "ADMIN",
    status: "ACTIVE",
    profile: { employeeId: `E2E-ADMIN-${runId}`, designation: "Test Administrator" },
  }));

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  await t.test("staff approval, doctor verification, and separate role sessions", async (t) => {
    const adminToken = await internalLogin(email("admin"));

    const staff = await expectStatus(request("/auth/register", {
      method: "POST",
      body: {
        name: "Disposable E2E Technician",
        email: email("tech"),
        password,
        role: "TECHNICIAN",
        phone: phone("8"),
        department: "Histology",
        profile: { employeeId: `E2E-TECH-${runId}`, qualification: "Diploma in Lab Technology" },
      },
    }), 201);
    remember(User, { id: staff.user.id });
    assert.equal((await expectStatus(request("/auth/login", { method: "POST", body: { identifier: email("tech"), password } }), 403)).message.includes("pending"), true);
    await expectStatus(request(`/users/admin/users/${staff.user.id}/approve`, { method: "PUT", token: adminToken }), 200);
    const techToken = await internalLogin(email("tech"));

    const pathologist = await expectStatus(request("/auth/register", {
      method: "POST",
      body: {
        name: "Disposable E2E Pathologist",
        email: email("pathologist"),
        password,
        role: "PATHOLOGIST",
        phone: phone("7"),
        department: "Pathology",
        profile: { medicalRegistrationId: `E2E-MED-${runId}`, qualification: "MD Pathology", specialization: "Histopathology" },
      },
    }), 201);
    remember(User, { id: pathologist.user.id });
    await expectStatus(request(`/users/admin/users/${pathologist.user.id}/approve`, { method: "PUT", token: adminToken }), 200);
    const pathologistToken = await internalLogin(email("pathologist"));

    const doctorPayload = (which, digit) => ({
      name: `Disposable E2E Doctor ${which}`,
      email: email(`doctor-${which.toLowerCase()}`),
      phone: phone(digit),
      medicalRegistrationId: `E2E-REG-${which}-${runId}`,
      registrationAuthority: "Test Medical Council",
      qualification: "MBBS, MD",
      specialization: "Surgical Pathology",
      hospital: "Disposable Test Hospital",
      password,
    });
    const doctorA = await expectStatus(request("/external-auth/doctor/register", { method: "POST", body: doctorPayload("A", "6") }), 201);
    remember(Doctor, { id: doctorA.doctor.id });
    await expectStatus(request("/external-auth/doctor/login", { method: "POST", body: { identifier: email("doctor-a"), password } }), 403);
    await expectStatus(request(`/doctor-verification/${doctorA.doctor.id}/approve`, { method: "PUT", token: techToken }), 403);
    await expectStatus(request(`/doctor-verification/${doctorA.doctor.id}/approve`, { method: "PUT", token: adminToken }), 200);
    const doctorAToken = await doctorLogin(email("doctor-a"));

    const doctorB = await expectStatus(request("/external-auth/doctor/register", { method: "POST", body: doctorPayload("B", "7") }), 201);
    remember(Doctor, { id: doctorB.doctor.id });
    await expectStatus(request(`/doctor-verification/${doctorB.doctor.id}/approve`, { method: "PUT", token: adminToken }), 200);
    const doctorBToken = await doctorLogin(email("doctor-b"));

    const registerPatient = async (which, digit) => {
      const patient = await expectStatus(request("/external-auth/patient/register", {
        method: "POST",
        body: { name: `Disposable E2E Patient ${which}`, phone: phone(digit), email: email(`patient-${which.toLowerCase()}`), password },
      }), 201);
      remember(Patient, { id: patient.patient.id });
      return { ...patient.patient, token: await patientLogin(email(`patient-${which.toLowerCase()}`)) };
    };
    const patientA = await registerPatient("A", "8");
    const patientB = await registerPatient("B", "9");

    assert.ok(adminToken && techToken && pathologistToken && doctorAToken && doctorBToken && patientA.token && patientB.token);
    t.diagnostic("separate authenticated sessions established for admin, technician, pathologist, two doctors, and two patients");

    await t.test("case assignment, specimen to slide workflow, QC, report controls, scoping, audit access and notifications", async () => {
      await expectStatus(request("/cases", { token: doctorAToken }), 403);
      await expectStatus(request("/external-dashboard/patient", { token: patientA.token }), 200);

      const caseA = await expectStatus(request("/cases", {
        method: "POST",
        token: techToken,
        body: { caseId: `E2E-${runId}-A`, patient: patientA.id, doctor: doctorA.doctor.id, caseType: "Histopathology", clinicalHistory: "Synthetic integration fixture.", priority: "NORMAL" },
      }), 201);
      remember(Case, { id: caseA.case._id });
      const caseB = await expectStatus(request("/cases", {
        method: "POST",
        token: techToken,
        body: { caseId: `E2E-${runId}-B`, patient: patientB.id, doctor: doctorB.doctor.id, caseType: "Histopathology", clinicalHistory: "Synthetic integration fixture.", priority: "NORMAL" },
      }), 201);
      remember(Case, { id: caseB.case._id });

      const specimen = await expectStatus(request("/specimens", {
        method: "POST", token: techToken,
        body: { specimenId: `E2E-SP-${runId}`, case: caseA.case._id, specimenType: "Biopsy", collectionSite: "Synthetic fixture", condition: "GOOD" },
      }), 201);
      remember(Specimen, { id: specimen.specimen._id });
      const block = await expectStatus(request("/blocks", {
        method: "POST", token: techToken,
        body: { blockId: `E2E-BL-${runId}`, specimen: specimen.specimen._id, case: caseA.case._id, blockType: "Paraffin", tissueDescription: "Synthetic fixture" },
      }), 201);
      remember(Block, { id: block.block._id });
      const slide = await expectStatus(request("/slides", {
        method: "POST", token: techToken,
        body: { slideId: `E2E-SL-${runId}`, block: block.block._id, case: caseA.case._id, slideType: "H&E", stainingMethod: "Hematoxylin and eosin" },
      }), 201);
      remember(Slide, { id: slide.slide._id });

      const events = [
        { stage: "SPECIMEN_COLLECTION", specimen: specimen.specimen._id },
        { stage: "ACCESSIONING", specimen: specimen.specimen._id },
        { stage: "GROSSING", block: block.block._id },
        { stage: "EMBEDDING", block: block.block._id },
        { stage: "SECTIONING", block: block.block._id },
        { stage: "STAINING", slide: slide.slide._id },
        { stage: "SCANNING", slide: slide.slide._id },
        { stage: "PATHOLOGIST_REVIEW", slide: slide.slide._id },
      ];
      for (const event of events) {
        const created = await expectStatus(request("/workflow", {
          method: "POST", token: event.stage === "PATHOLOGIST_REVIEW" ? pathologistToken : techToken,
          body: { case: caseA.case._id, ...event, status: "COMPLETED", notes: "Synthetic E2E transition" },
        }), 201);
        remember(WorkflowEvent, { id: created._id });
      }
      const storedEvents = await expectStatus(request(`/workflow/case/E2E-${runId}-A`, { token: pathologistToken }), 200);
      assert.equal(storedEvents.length, events.length);

      const qc = await expectStatus(request("/qc", {
        method: "POST", token: pathologistToken,
        body: { qcId: `E2E-QC-${runId}`, case: caseA.case._id, slide: slide.slide._id, sectionQuality: "GOOD", stainingQuality: "GOOD", labelingCheck: "PASS", documentationCheck: "PASS", overallStatus: "PASSED", findings: "Synthetic fixture passed QC" },
      }), 201);
      remember(QCRecord, { id: qc.qcRecord._id });

      const draft = await expectStatus(request("/reports", {
        method: "POST", token: pathologistToken,
        body: { reportId: `E2E-RP-${runId}`, case: caseA.case._id, slide: slide.slide._id, diagnosis: "Synthetic test diagnosis", microscopicFindings: "Synthetic fixture only" },
      }), 201);
      remember(Report, { id: draft.report._id });
      await expectStatus(request(`/reports/${draft.report._id}/sign-out`, { method: "POST", token: techToken }), 403);

      const patientDraftDashboard = await expectStatus(request("/external-dashboard/patient", { token: patientA.token }), 200);
      assert.equal(patientDraftDashboard.cases.some((item) => item.caseId === `E2E-${runId}-A`), true);
      assert.equal(patientDraftDashboard.reports.some((item) => item.reportId === `E2E-RP-${runId}`), false);
      assert.equal((await expectStatus(request("/external-dashboard/patient", { token: patientB.token }), 200)).cases.some((item) => item.caseId === `E2E-${runId}-A`), false);

      const doctorOwn = await expectStatus(request("/external-dashboard/doctor", { token: doctorAToken }), 200);
      assert.equal(doctorOwn.cases.some((item) => item.caseId === `E2E-${runId}-A`), true);
      assert.equal((await expectStatus(request("/external-dashboard/doctor", { token: doctorBToken }), 200)).cases.some((item) => item.caseId === `E2E-${runId}-A`), false);
      await expectStatus(request(`/cases/E2E-${runId}-A`, { token: doctorAToken }), 403);
      await expectStatus(request(`/reports/${draft.report._id}`, { token: patientA.token }), 403);

      const signedOut = await expectStatus(request(`/reports/${draft.report._id}/sign-out`, { method: "POST", token: pathologistToken }), 200);
      assert.equal(signedOut.report.reportStatus, "FINAL");
      await expectStatus(request(`/reports/${draft.report._id}/sign-out`, { method: "POST", token: pathologistToken }), 400);
      await expectStatus(request(`/reports/${draft.report._id}`, { method: "PUT", token: pathologistToken, body: { diagnosis: "Attempt to edit finalized report" } }), 400);

      const patientFinal = await expectStatus(request("/external-dashboard/patient", { token: patientA.token }), 200);
      assert.equal(patientFinal.reports.some((item) => item.reportId === `E2E-RP-${runId}` && item.reportStatus === "FINAL"), true);
      assert.equal((await expectStatus(request("/external-dashboard/doctor", { token: doctorAToken }), 200)).reports.some((item) => item.reportId === `E2E-RP-${runId}`), true);

      const notice = await expectStatus(request("/notifications", {
        method: "POST", token: adminToken,
        body: { recipient: staff.user.id, title: "Disposable E2E notification", message: "Synthetic workflow completion notification", type: "REPORT_ALERT", priority: "LOW", resourceType: "Report", resourceId: draft.report._id },
      }), 201);
      remember(Notification, { id: notice.notification._id });
      const staffNotices = await expectStatus(request("/notifications", { token: techToken }), 200);
      assert.equal(staffNotices.notifications.some((item) => item._id === notice.notification._id), true);
      assert.equal((await expectStatus(request("/notifications", { token: pathologistToken }), 200)).notifications.some((item) => item._id === notice.notification._id), false);

      await expectStatus(request("/audit", { token: patientA.token }), 403);
      await expectStatus(request("/audit", { token: adminToken }), 200);
      const auditHistory = await expectStatus(request(`/audit/resource/Report/${draft.report._id}`, { token: adminToken }), 200);
      assert.ok(Array.isArray(auditHistory.logs));
    });
  });
});

test.after(async () => {
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
  if (mongoose.connection.readyState === 1) {
    const fixtureIds = [...ownedIds.values()].flat().filter(Boolean).map(String);
    const internalRecipients = ownedIds.get(User).filter(Boolean);
    const doctorRecipients = ownedIds.get(Doctor).filter(Boolean);
    const patientRecipients = ownedIds.get(Patient).filter(Boolean);
    if (fixtureIds.length) await AuditLog.deleteMany({ resourceId: { $in: fixtureIds } });
    const notificationScope = [];
    if (fixtureIds.length) notificationScope.push({ resourceId: { $in: fixtureIds } });
    if (internalRecipients.length) notificationScope.push({ recipient: { $in: internalRecipients }, $or: [{ recipientModel: "User" }, { recipientModel: { $exists: false } }] });
    if (doctorRecipients.length) notificationScope.push({ recipient: { $in: doctorRecipients }, recipientModel: "Doctor" });
    if (patientRecipients.length) notificationScope.push({ recipient: { $in: patientRecipients }, recipientModel: "Patient" });
    if (notificationScope.length) await Notification.deleteMany({ $or: notificationScope });
    for (const Model of models) {
      const ids = ownedIds.get(Model).filter(Boolean);
      if (ids.length) await Model.deleteMany({ _id: { $in: ids } });
    }
    await mongoose.disconnect();
  }
});
