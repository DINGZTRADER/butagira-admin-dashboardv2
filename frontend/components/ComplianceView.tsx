import React, { useState } from 'react';
import { Card } from './ui/Card';
import { CheckmarkIcon } from './ui/Icons';

const ugandanLegalInfo = {
    confidentiality: {
        title: "Client Confidentiality",
        points: [
            "Verify client identity before disclosing any information (Know Your Customer).",
            "Use secure, encrypted channels for all digital communication.",
            "Ensure adherence to the Advocates (Professional Conduct) Regulations regarding privileged communication.",
            "Comply with the Data Protection and Privacy Act, 2019 for all client personal data.",
            "Store physical documents securely in locked cabinets with restricted access."
        ]
    },
    filing: {
        title: "Court Filing (High Court)",
        points: [
            "File all pleadings at the relevant court registry (e.g., Commercial, Civil, Family Division).",
            "Ensure pleadings are commissioned by a Commissioner for Oaths before filing.",
            "Adhere to the Civil Procedure Rules S.I 71-1 for formatting and timelines.",
            "Serve filed documents upon opposing parties within statutory time limits and file an Affidavit of Service."
        ]
    },
    corporate: {
        title: "Corporate & Commercial Practice",
        points: [
            "Ensure all company registrations and annual returns are filed with the Uganda Registration Services Bureau (URSB).",
            "Verify all corporate actions comply with the Companies Act, 2012.",
            "Draft commercial agreements to be compliant with the Contracts Act, 2010.",
            "Advise clients on tax obligations with the Uganda Revenue Authority (URA) for all transactions."
        ]
    },
    conveyancing: {
        title: "Real Estate & Conveyancing",
        points: [
            "Conduct a thorough title search at the relevant Ministry of Lands zonal office.",
            "Obtain spousal consent for any transactions involving family land as required by the Land Act.",
            "Ensure proper valuation and payment of stamp duty through the URA portal before registration.",
            "Lodge all registered documents with the registrar for issuance of a new title."
        ]
    },
    ethics: {
        title: "Ethical Standards",
        points: [
            "Strictly avoid conflicts of interest between clients as per the Advocates Act (Cap 267).",
            "Maintain a separate client account for all client funds, distinct from the firm's operational account.",
            "Uphold the duty to the court as an officer of the court, which may supersede duty to a client.",
            "Charge fair fees as per the Advocates (Remuneration and Taxation of Costs) Rules."
        ]
    }
};

type InfoKey = keyof typeof ugandanLegalInfo;

export const ComplianceView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<InfoKey>('confidentiality');
    const activeInfo = ugandanLegalInfo[activeTab];

    return (
        <div className="space-y-6">
             <Card>
                <h2 className="text-2xl font-bold text-white mb-1">Practice Standards & Ethics Hub</h2>
                <p className="text-gray-400">A guide to essential administrative protocols and ethical standards within the Ugandan legal framework.</p>
            </Card>
            <div className="flex space-x-2 border-b border-brand-mid/50 mb-6 overflow-x-auto pb-1">
                {(Object.keys(ugandanLegalInfo) as InfoKey[]).map(key => (
                     <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`py-2 px-4 font-semibold transition-colors duration-200 whitespace-nowrap ${
                            activeTab === key
                            ? 'border-b-2 border-brand-accent text-brand-accent'
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {ugandanLegalInfo[key].title}
                    </button>
                ))}
            </div>
            
            <Card>
                <h3 className="text-xl font-semibold text-white mb-4">{activeInfo.title}</h3>
                <ul className="space-y-3">
                    {activeInfo.points.map((point, index) => (
                         <li key={index} className="flex items-start p-3 bg-brand-dark/50 rounded-md">
                            <CheckmarkIcon />
                            <span className="ml-3 text-gray-300">{point}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};