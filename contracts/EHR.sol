// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "./Roles.sol";

contract EHR {
    using Roles for Roles.Role;

    Roles.Role private admin;
    Roles.Role private doctor;
    Roles.Role private patient;

    struct Doctor {
        string docHash;
    }

    struct Patient {
        string patHash;
    }

    struct MedicalRecord {
        string recHash;
    }

    mapping(address => Doctor) Doctors;
    mapping(address => Patient) Patients;
    mapping(address => MedicalRecord) Records;

    address[] public DocIds;
    address[] public PatIds;
    string[] public RecordHashes;

    address admin_id;
    address patient_id;
    address doctor_id;

    // Constructor
    constructor() public {
        admin_id = msg.sender;
        admin.add(admin_id);
    }

    // Get Admin
    function getAdmin() public view returns (address) {
        return admin_id;
    }

    /* DOCTORS */

    function addDoctorInfo(address publicKey, string memory _drInfo_hash)
        public
        onlyAdmin
    {
        Doctor storage drInfo = Doctors[publicKey];
        drInfo.docHash = _drInfo_hash;
        DocIds.push(publicKey);

        doctor.add(publicKey);
    }

    function updateDoctorInfo(address publicKey, string memory _drInfo_hash)
        public
    {
        Doctor storage drInfo = Doctors[msg.sender];
        drInfo.docHash = _drInfo_hash;
        DocIds.push(publicKey);
    }

    // function addDoctor(address publicKey) external onlyAdmin {
    //     doctor.add(publicKey);
    // }

    function deleteDoctor(address publicKey) external onlyAdmin {
        doctor.remove(publicKey);
    }

    function getDoctorId() public view returns (address) {
        return doctor_id;
    }

    // function search(address _id)public{
    //     doctor_id = _id;
    // }

    // function getDoctorInfo() public view returns (string memory) {
    //     return (Doctors[doctor_id].docHash);
    // }

    function getDoctorInfoByAddress(address publicKey)
        public
        view
        returns (string memory)
    {
        if (doctor.has(publicKey)) {
            return (Doctors[publicKey].docHash);
        } else {
            return "error";
        }
    }

    // function isDoctor(address publicKey) public view returns (string memory) {
    //     require(doctor.has(publicKey), "Only for Doctors");
    //     return "1";
    // }

    function isDoctor(address publicKey) public view returns (bool) {
        return doctor.has(publicKey);
    }

    function getDoctorsCount() public view returns (uint256) {
        return (DocIds.length);
    }

    /* PATIENT */

    function addPatientInfo(address publicKey, string memory _patInfo_hash)
        public
        onlyAdmin
    {
        Patient storage patInfo = Patients[publicKey];
        patInfo.patHash = _patInfo_hash;
        PatIds.push(publicKey);

        patient.add(publicKey);
    }

    function isPatient(address publicKey) public view returns (bool) {
        return patient.has(publicKey);
    }

    // function addPatient(address publicKey) external onlyAdmin {
    //     patient.add(publicKey);
    // }

    function deletePatient(address publicKey) external onlyAdmin {
        patient.remove(publicKey);
    }

    function updatePatientInfo(address publicKey, string memory _patInfo_hash)
        public
    {
        Patient storage patInfo = Patients[msg.sender];
        patInfo.patHash = _patInfo_hash;
        PatIds.push(publicKey);
    }

    // function addRecord(address _patId) external onlyDoctor {
    //     require(patient.has(_patId) == true, "is not a Patient");
    //     patient_id = _patId;
    // }

    // function viewPatRec(address _patid) public{
    //     get_patient_id = _patid;
    // }

    // function get() public view  returns(address){
    //     return msg.sender;
    // }

    // function getPatientId() public view returns (address) {
    //     return patient_id;
    // }

    function getPatientInfoByAddress(address publicKey)
        public
        view
        returns (string memory)
    {
        if (patient.has(publicKey)) {
            return (Patients[publicKey].patHash);
        } else {
            return "error";
        }
    }

    /* MEDICAL RECORDS */

    function addMedicalRecord(string memory _recHash, address _pat_id)
        public
        onlyDoctor
    {
        MedicalRecord storage record = Records[_pat_id];
        record.recHash = _recHash;
        RecordHashes.push(_recHash);
    }

    function viewMedicalRecord(address _pat_id)
        public
        view
        returns (string memory)
    {
        return (Records[_pat_id].recHash);
    }

    /* MODIFIERS */

    modifier onlyAdmin() {
        require(admin.has(msg.sender) == true, "Only Admin Can Do That");
        _;
    }
    modifier onlyDoctor() {
        require(doctor.has(msg.sender) == true, "Only Doctor Can Do That");
        _;
    }
    modifier onlyPatient() {
        require(patient.has(msg.sender) == true, "Only Patient Can Do That");
        _;
    }
}
