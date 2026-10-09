import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";

const AddUserHeader = () => (
  <>
    <div className="add-user-topbar">
      <Link to="/users" className="add-user-back-link">
        <ArrowLeft size={17} />
        Back to staff
      </Link>
      <span className="add-user-breadcrumb">
        Administration <span>/</span> Staff management
      </span>
    </div>

    <header className="add-user-heading">
      <div className="add-user-heading-icon">
        <UserPlus size={26} />
      </div>
      <div>
        <p className="add-user-eyebrow">STAFF MANAGEMENT</p>
        <h1>Add staff member</h1>
        <p>
          Create a staff registration with the correct laboratory role and
          professional credentials.
        </p>
      </div>
    </header>
  </>
);

export default AddUserHeader;
