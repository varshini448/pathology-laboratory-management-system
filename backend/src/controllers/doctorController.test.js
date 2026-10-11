const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const Doctor = require("../models/Doctor");
const { getDoctors, getDoctorById } = require("./doctorController");

const originals = { find: Doctor.find, findById: Doctor.findById };
afterEach(() => { Doctor.find = originals.find; Doctor.findById = originals.findById; });
const response = () => ({ body: null, statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
const record = { _id: "doctor-1", doctorId: "DOC-1", name: "Dr Example", password: "hash-value", lastLogin: new Date(), createdBy: "user-1", specialization: "Pathology" };

test("doctor directory excludes password hashes and unrelated account metadata", async () => {
  let projection;
  Doctor.find = () => ({ select(value) { projection = value; return this; }, sort() { return Promise.resolve([record]); } });
  const res = response();
  await getDoctors({}, res);
  assert.equal(projection, "-password -lastLogin -createdBy");
  assert.equal(res.body.doctors[0].password, undefined);
  assert.equal(res.body.doctors[0].lastLogin, undefined);
});

test("doctor detail response excludes password hashes", async () => {
  Doctor.findById = () => ({ select() { return Promise.resolve(record); } });
  const res = response();
  await getDoctorById({ params: { id: "doctor-1" } }, res);
  assert.equal(res.body.doctor.password, undefined);
});
