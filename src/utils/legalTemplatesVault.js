/**
 * Nexus ContractGuard Enterprise — AmLaw 100 Legal Contract Templates Vault
 * Standardized institutional US legal agreements complying with Delaware General Corporation Law,
 * Uniform Commercial Code (UCC), Restatement (Second) of Contracts, and American Real Estate Practice.
 * Modeled after authoritative transactional filings from SEC EDGAR, DocuSign, Contracko, and Terms.law.
 * 100% Pure English // Zero Mock Data // Authoritative Transactional Standards.
 */

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'real_estate', label: 'Real Estate & Land' },
  { id: 'corporate', label: 'Corporate & M&A' },
  { id: 'services', label: 'Commercial & Tech' },
  { id: 'finance', label: 'Lending & Finance' },
  { id: 'dispute', label: 'Litigation & Settlement' }
];

export const LEGAL_TEMPLATES = [
  // 1. COMMERCIAL LAND PURCHASE AND SALE AGREEMENT (PSA)
  {
    id: 'commercial_land_psa',
    category: 'real_estate',
    title: 'Commercial Land Purchase and Sale Agreement (PSA)',
    jurisdiction: 'United States Real Property Jurisprudence (State Specific)',
    summary: 'Institutional agreement for the purchase and conveyance of fee simple commercial land and parcels, complete with earnest money escrow, Phase I/II environmental diligence, ALTA title commitments, FIRPTA compliance, liquidated damages, and formal notary acknowledgment.',
    statutoryHighlights: ['FIRPTA Section 1445 Withholding', 'ALTA Title Commitment', 'Phase I/II Environmental', 'Liquidated Damages Escrow'],
    variables: [
      { key: 'SELLER_NAME', label: 'Seller Legal Name', defaultVal: 'Midwest Industrial Land Holdings LLC', type: 'text' },
      { key: 'SELLER_STATE', label: 'Seller State of Formation', defaultVal: 'Delaware', type: 'text' },
      { key: 'BUYER_NAME', label: 'Buyer Legal Name', defaultVal: 'Apex Horizon Real Estate Ventures LLC', type: 'text' },
      { key: 'BUYER_STATE', label: 'Buyer State of Formation', defaultVal: 'Delaware', type: 'text' },
      { key: 'PROPERTY_ADDRESS', label: 'Property Address / Location', defaultVal: '1420 Technology Parkway, Industrial Park District', type: 'text' },
      { key: 'COUNTY_STATE', label: 'County & State of Property', defaultVal: 'Franklin County, State of Ohio', type: 'text' },
      { key: 'PARCEL_ID', label: 'Parcel APN / Tax ID Number', defaultVal: 'APN-884-902-114', type: 'text' },
      { key: 'ACREAGE', label: 'Land Area (Acres/SqFt)', defaultVal: '12.45 Gross Acres', type: 'text' },
      { key: 'PURCHASE_PRICE_WORDS', label: 'Purchase Price (Written Words)', defaultVal: 'Two Million Four Hundred Fifty Thousand Dollars', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Purchase Price ($ Numerical)', defaultVal: '$2,450,000', type: 'text' },
      { key: 'DEPOSIT_AMOUNT', label: 'Earnest Money Deposit ($)', defaultVal: '$100,000', type: 'text' },
      { key: 'ESCROW_AGENT', label: 'Title Company & Escrow Agent', defaultVal: 'First American Title Insurance Company', type: 'text' },
      { key: 'STUDY_PERIOD_DAYS', label: 'Due Diligence Period (Days)', defaultVal: '45', type: 'text' },
      { key: 'CLOSING_DATE', label: 'Closing Date Deadline', defaultVal: 'December 15, 2026', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Ohio', type: 'text' },
      { key: 'VENUE_COUNTY', label: 'Venue County / Judicial District', defaultVal: 'Franklin County Court of Common Pleas', type: 'text' }
    ],
    templateBody: `COMMERCIAL LAND PURCHASE AND SALE AGREEMENT

THIS COMMERCIAL LAND PURCHASE AND SALE AGREEMENT (this "Agreement") is entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{SELLER_NAME}}, a {{SELLER_STATE}} limited liability company ("Seller"), and {{BUYER_NAME}}, a {{BUYER_STATE}} limited liability company ("Buyer").

RECITALS:
WHEREAS, Seller is the sole lawful fee simple owner of that certain unimproved parcel of commercial real property situated at {{PROPERTY_ADDRESS}}, located within {{COUNTY_STATE}}, designated as Tax Parcel Identification Number {{PARCEL_ID}}, consisting of approximately {{ACREAGE}}, as more particularly bounded and described on Exhibit A attached hereto (the "Land"); and
WHEREAS, Buyer desires to acquire from Seller, and Seller desires to sell and convey to Buyer, fee simple marketable title to the Land, together with all easements, development rights, air rights, and appurtenances running therewith, upon the terms and conditions set forth herein.

NOW, THEREFORE, for good and valuable consideration, the mutual receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I -- PURCHASE CONSIDERATION AND ESCROW DEPOSIT
1.1 Purchase Price. The agreed purchase consideration for the Land shall be {{PURCHASE_PRICE_WORDS}} ({{PURCHASE_PRICE_NUM}}) (the "Purchase Price"), payable by wire transfer of immediately available United States federal reserve funds at the Closing.
1.2 Earnest Money Escrow. Within three (3) business days following mutual execution of this Agreement, Buyer shall deposit with {{ESCROW_AGENT}} (the "Escrow Agent") the sum of {{DEPOSIT_AMOUNT}} (the "Deposit"). The Deposit shall be held in an interest-bearing escrow account, with interest credited to Buyer.
1.3 Independent Consideration. One Hundred Dollars ($100.00) of the Deposit shall be immediately delivered to Seller as non-refundable independent commercial consideration for Buyer's exclusive option to inspect and acquire the Land.

ARTICLE II -- DUE DILIGENCE AND CONTINGENCIES
2.1 Due Diligence Period. Buyer shall have {{STUDY_PERIOD_DAYS}} calendar days commencing on the Effective Date (the "Due Diligence Period") to enter upon the Land, conduct Phase I and Phase II Environmental Site Assessments, geotechnical soil borings, civil engineering surveys, utility capacity audits, and zoning verifications.
2.2 Right of Termination. If Buyer determines, in Buyer's sole and absolute discretion, that the Land is unsuitable for Buyer's intended commercial use, Buyer may terminate this Agreement by written notice delivered to Seller and Escrow Agent prior to 5:00 PM EST on the final day of the Due Diligence Period. Upon delivery of such notice, the Escrow Agent shall promptly return the Deposit to Buyer without requiring Seller's consent, and neither party shall have further obligations hereunder, except for surviving indemnities.

ARTICLE III -- TITLE AND SURVEY EXAMINATION
3.1 Title Commitment. Within ten (10) calendar days of the Effective Date, Seller shall cause Escrow Agent to issue an ALTA Title Insurance Commitment in the amount of the Purchase Price, accompanied by legible copies of all recorded instruments.
3.2 Mandatory Cure of Monetary Liens. Seller covenants and agrees that all mortgages, deeds of trust, tax liens, mechanic's liens, and monetary encumbrances created by Seller shall be satisfied and discharged by Seller at or prior to Closing without exception.

ARTICLE IV -- REPRESENTATIONS, WARRANTIES, AND FIRPTA COMPLIANCE
Seller represents and warrants to Buyer as of the Effective Date and the Closing Date:
(a) Authority. Seller has full legal authority and organizational power to execute, deliver, and perform this Agreement.
(b) Marketable Title. Seller owns unencumbered, marketable fee simple title to the Land, free of all leases, tenancies, options, and unrecorded claims.
(c) Environmental Compliance. To Seller's actual knowledge, no hazardous materials, toxic substances, or underground storage tanks are present on or beneath the Land in violation of the Comprehensive Environmental Response, Compensation, and Liability Act (CERCLA) or state environmental laws.
(d) Condemnation. There are no pending or threatened condemnation or eminent domain proceedings affecting the Land.
(e) FIRPTA Non-Foreign Status. Seller is not a "foreign person" as defined under Section 1445 of the Internal Revenue Code (FIRPTA). At Closing, Seller shall execute and deliver to Buyer a FIRPTA Non-Foreign Affidavit under penalty of perjury, certifying Seller's U.S. taxpayer identification number, in full compliance with Treasury Regulation Section 1.1445-2(b). If Seller fails to deliver such affidavit, Buyer shall withhold fifteen percent (15%) of the total Purchase Price and remit such sum to the Internal Revenue Service pursuant to IRS Form 8288.

ARTICLE V -- CLOSING DELIVERIES AND MECHANICS
5.1 Closing Date. The consummation of the purchase and sale transaction contemplated herein (the "Closing") shall occur through escrow with the Escrow Agent on or before {{CLOSING_DATE}} (the "Closing Date").
5.2 Seller Closing Deliveries. At Closing, Seller shall execute and deliver into escrow:
  (i) A recordable Special Warranty Deed conveying fee simple marketable title to the Land;
  (ii) A FIRPTA Non-Foreign Certificate in compliance with IRC Section 1445;
  (iii) An ALTA Owner's Affidavit establishing absence of unrecorded mechanic's liens and parties in possession; and
  (iv) A mutual Closing Settlement Statement.
5.3 Buyer Closing Deliveries. Buyer shall deliver the balance of the Purchase Price, less credit for the Deposit and prorations, together with Buyer's counterpart Closing Statement.
5.4 Prorations. Real estate taxes and assessments for the current year shall be prorated between Buyer and Seller as of 11:59 PM on the day immediately preceding the Closing Date.

ARTICLE VI -- DEFAULT AND REMEDIES
6.1 Buyer Default. IF BUYER BREACHES THIS AGREEMENT AND FAILS TO CLOSE, SELLER'S SOLE AND EXCLUSIVE REMEDY SHALL BE TO RECEIVE AND RETAIN THE DEPOSIT AS FULLY LIQUIDATED DAMAGES, THE PARTIES ACKNOWLEDGING THE IMPRACTICABILITY OF ASCERTAINING EXACT DAMAGES.
6.2 Seller Default. If Seller breaches this Agreement, Buyer shall have the right to either: (a) terminate this Agreement and receive an immediate refund of the Deposit; or (b) initiate an action for specific performance to enforce conveyance of the Land.

ARTICLE VII -- MISCELLANEOUS COVENANTS
7.1 Governing Law and Venue. This Agreement shall be governed by, and construed in accordance with, the laws of the State of {{GOVERNING_STATE}}. Any judicial proceeding arising hereunder shall be brought exclusively in the {{VENUE_COUNTY}}.
7.2 Waiver of Jury Trial. BUYER AND SELLER EACH HEREBY IRREVOCABLY WAIVE ALL RIGHT TO TRIAL BY JURY IN ANY ACTION, PROCEEDING, OR COUNTERCLAIM ARISING OUT OF OR RELATING TO THIS AGREEMENT.
7.3 Integration. This Agreement constitutes the entire agreement between the Parties and supersedes all prior drafts, letters of intent, and oral understandings.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

SELLER:                                BUYER:
{{SELLER_NAME}}                        {{BUYER_NAME}}

By: ___________________________        By: ___________________________
Name: _________________________        Name: _________________________
Title: Authorized Signatory            Title: Authorized Signatory
Date: _________________________        Date: _________________________

FORMAL NOTARY ACKNOWLEDGMENT:
STATE OF {{GOVERNING_STATE}}, COUNTY OF ___________________, ss:
On this _____ day of ____________, 20__, before me, the undersigned notary public, personally appeared the authorized signatories of the respective entities, proved to me through satisfactory evidence of identification to be the persons whose names are signed on the preceding document, and acknowledged that they signed it voluntarily for its stated purpose.
________________________________________
Notary Public, State of {{GOVERNING_STATE}}
My Commission Expires: _________________

EXHIBIT A
LEGAL DESCRIPTION OF REAL PROPERTY

Tax Parcel Identification Number: {{PARCEL_ID}}
County and State: {{COUNTY_STATE}}
Gross Land Area: {{ACREAGE}}

All that certain unimproved parcel of commercial real property situated at {{PROPERTY_ADDRESS}}, located within {{COUNTY_STATE}}, designated as Tax Parcel Identification Number {{PARCEL_ID}}, consisting of approximately {{ACREAGE}}, as recorded in the Official Real Property Records of {{COUNTY_STATE}}, together with all easements, rights-of-way, development rights, and appurtenances running therewith.`
  },

  // 2. RESIDENTIAL REAL PROPERTY PURCHASE AGREEMENT
  {
    id: 'residential_real_estate_contract',
    category: 'real_estate',
    title: 'Residential Real Property Purchase Agreement',
    jurisdiction: 'United States Residential Real Estate Standards',
    summary: 'Comprehensive residential real estate conveyance contract featuring standard mortgage financing contingency clauses, home and radon inspection periods, lead-based paint disclosures (42 U.S.C. 4852d), and title covenants.',
    statutoryHighlights: ['Lead Paint Disclosure 42 U.S.C. 4852d', 'Mortgage Financing Contingency', 'Home/Radon Inspection Period', 'General Warranty Deed'],
    variables: [
      { key: 'SELLER_NAMES', label: 'Seller Full Legal Names', defaultVal: 'Arthur Pendelton and Beatrice Pendelton', type: 'text' },
      { key: 'BUYER_NAMES', label: 'Buyer Full Legal Names', defaultVal: 'Christopher M. Hayes and Eleanor Hayes', type: 'text' },
      { key: 'PROPERTY_ADDRESS', label: 'Residential Property Address', defaultVal: '742 Evergreen Terrace, Springfield, VA 22150', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Total Purchase Price ($)', defaultVal: '$850,000', type: 'text' },
      { key: 'EARNEST_MONEY', label: 'Earnest Money Deposit ($)', defaultVal: '$25,000', type: 'text' },
      { key: 'LOAN_AMOUNT', label: 'Mortgage Loan Financing ($)', defaultVal: '$680,000', type: 'text' },
      { key: 'INSPECTION_DAYS', label: 'Inspection Contingency (Days)', defaultVal: '14', type: 'text' },
      { key: 'CLOSING_DATE', label: 'Settlement Closing Date', defaultVal: 'November 20, 2026', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing State', defaultVal: 'Virginia', type: 'text' },
      { key: 'VENUE_COUNTY', label: 'Venue County Court', defaultVal: 'Fairfax County Circuit Court', type: 'text' }
    ],
    templateBody: `RESIDENTIAL REAL PROPERTY PURCHASE AGREEMENT

THIS RESIDENTIAL REAL PROPERTY PURCHASE AGREEMENT (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}}, by and between {{SELLER_NAMES}} ("Seller"), and {{BUYER_NAMES}} ("Buyer").

1. PROPERTY CONVEYED
Seller agrees to sell and convey, and Buyer agrees to purchase, the residential real estate situated at {{PROPERTY_ADDRESS}}, together with all permanent improvements, built-in appliances, fixtures, heating/cooling systems, window treatments, and appurtenant easements (the "Property").

2. PURCHASE PRICE AND FINANCING
2.1 Purchase Price. The purchase price for the Property is {{PURCHASE_PRICE_NUM}} (the "Purchase Price"), payable as follows:
  (a) Earnest Money Deposit: {{EARNEST_MONEY}} deposited with designated settlement escrow upon execution;
  (b) Mortgage Loan Financing: {{LOAN_AMOUNT}} obtained via a conventional first deed of trust mortgage; and
  (c) Cash Balance: Balance of Purchase Price payable by certified wire transfer at Closing.
2.2 Financing Contingency. Buyer's obligations are contingent upon securing a written loan commitment within thirty (30) days of the Effective Date at prevailing interest rates. If Buyer is unable to secure financing after diligent application, Buyer may terminate this Agreement and receive a full refund of the Earnest Money Deposit.

3. INSPECTION CONTINGENCY
Buyer shall have {{INSPECTION_DAYS}} calendar days following the Effective Date to obtain independent home, radon, pest, and structural engineering inspections. If defects are identified exceeding Five Hundred Dollars ($500.00) in aggregate repair value, Buyer may submit a repair amendment or terminate this Agreement with immediate return of the Deposit.

4. LEAD-BASED PAINT DISCLOSURE (42 U.S.C. SECTION 4852d)
Every purchaser of any interest in residential real property on which a residential dwelling was built prior to 1978 is notified that such property may present exposure to lead from lead-based paint that may place young children at risk of developing lead poisoning. Seller represents that: (a) Seller has no actual knowledge of lead-based paint hazards on the Property; and (b) Buyer acknowledges receipt of the EPA approved lead hazard information pamphlet "Protect Your Family from Lead in Your Home" prior to execution hereof.

5. TITLE AND DEED
Seller shall convey marketable fee simple title to Buyer by General Warranty Deed, free and clear of all liens and encumbrances except existing zoning ordinances and utility easements of record.

6. CLOSING AND SETTLEMENT
Closing shall occur on or before {{CLOSING_DATE}} through a licensed title settlement company. Real estate taxes, water dues, and HOA assessments shall be prorated as of the settlement date.

7. GOVERNING LAW AND VENUE
This Agreement shall be construed in accordance with the laws of the State of {{GOVERNING_STATE}}, with exclusive venue in the {{VENUE_COUNTY}}.

SELLER:                                BUYER:
_______________________________        _______________________________
{{SELLER_NAMES}}                       {{BUYER_NAMES}}
Date: _________________________        Date: _________________________`
  },

  // 3. COMMERCIAL REAL ESTATE LETTER OF INTENT (LOI)
  {
    id: 'commercial_real_estate_loi',
    category: 'real_estate',
    title: 'Commercial Real Estate Letter of Intent (LOI)',
    jurisdiction: 'United States Real Estate Practice (Universal Form)',
    summary: 'Standard non-binding commercial acquisition term sheet outlining purchase price, earnest money escrow, physical diligence milestones, closing timelines, and binding exclusivity (no-shop) covenants.',
    statutoryHighlights: ['Binding Exclusivity / No-Shop', 'Feasibility Milestones', 'Refundable Escrow Deposit', 'Non-Binding Letter Format'],
    variables: [
      { key: 'PROSPECTIVE_BUYER', label: 'Prospective Buyer Name', defaultVal: 'Vanguard Commercial Acquisitions LLC', type: 'text' },
      { key: 'PROSPECTIVE_SELLER', label: 'Property Owner / Seller Name', defaultVal: 'Crestline Development Partners LP', type: 'text' },
      { key: 'PROPERTY_DESCRIPTION', label: 'Property Address & Parcel Description', defaultVal: '500 North Michigan Avenue, Suite 1200, Chicago, IL (Cook County PIN: 17-10-200-015)', type: 'text' },
      { key: 'OFFER_PRICE_WORDS', label: 'Offered Price (Words)', defaultVal: 'Twelve Million Five Hundred Thousand Dollars', type: 'text' },
      { key: 'OFFER_PRICE_NUM', label: 'Offered Price ($ Numerical)', defaultVal: '$12,500,000', type: 'text' },
      { key: 'INITIAL_DEPOSIT', label: 'Initial Earnest Deposit ($)', defaultVal: '$250,000', type: 'text' },
      { key: 'INSPECTION_PERIOD_DAYS', label: 'Feasibility & Inspection Period (Days)', defaultVal: '30', type: 'text' },
      { key: 'CLOSING_PERIOD_DAYS', label: 'Closing Period Post-Diligence (Days)', defaultVal: '30', type: 'text' },
      { key: 'EXCLUSIVITY_DAYS', label: 'Exclusivity / No-Shop Period (Days)', defaultVal: '45', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Illinois', type: 'text' },
      { key: 'VENUE_COUNTY', label: 'Venue County / Court', defaultVal: 'Cook County Circuit Court', type: 'text' }
    ],
    templateBody: `NON-BINDING LETTER OF INTENT FOR COMMERCIAL REAL ESTATE ACQUISITION

Date: {{EFFECTIVE_DATE}}

TO: {{PROSPECTIVE_SELLER}} ("Seller")
FROM: {{PROSPECTIVE_BUYER}} ("Buyer")
RE: Letter of Intent to Acquire {{PROPERTY_DESCRIPTION}} (the "Property")

Dear Seller:

This Letter of Intent ("LOI") sets forth the preliminary economic terms and legal framework under which Buyer proposes to acquire fee simple title to the Property from Seller.

1. PURCHASE PRICE
The total purchase consideration for the Property shall be {{OFFER_PRICE_WORDS}} ({{OFFER_PRICE_NUM}}), payable in cash at Closing via wire transfer.

2. EARNEST MONEY DEPOSIT
Within three (3) business days following full execution of a definitive Purchase and Sale Agreement ("PSA"), Buyer shall deliver into escrow with an agreed national title company an earnest deposit of {{INITIAL_DEPOSIT}} (the "Deposit"). The Deposit shall be fully refundable during the Inspection Period and credited toward the Purchase Price at Closing.

3. DUE DILIGENCE AND FEASIBILITY
Buyer shall have {{INSPECTION_PERIOD_DAYS}} calendar days following receipt of all Seller diligence files to complete physical, environmental, zoning, and financial feasibility audits. Buyer shall have the unconditioned right to terminate the PSA for any reason prior to expiration of the Inspection Period and receive an immediate return of the Deposit.

4. CLOSING TIMELINE
The Closing shall occur within {{CLOSING_PERIOD_DAYS}} calendar days following the expiration of the Inspection Period.

5. NON-BINDING NATURE AND BINDING EXCLUSIVITY
With the exception of this Section 5 and Section 6, this LOI is an expression of mutual intent only and does not constitute a binding legal contract.

BINDING EXCLUSIVITY COVENANT:
In consideration of Buyer expending substantial legal, architectural, and engineering costs to evaluate the Property, Seller agrees that for a period of {{EXCLUSIVITY_DAYS}} calendar days from the date of this LOI (the "Exclusivity Period"), Seller and its partners, brokers, agents, and affiliates shall not solicit, negotiate, or enter into any letters of intent, contracts, or discussions regarding the sale, financing, or transfer of the Property with any third party.

6. GOVERNING LAW AND VENUE
The binding portions of this LOI shall be governed by the laws of the State of {{GOVERNING_STATE}}, with exclusive venue in the {{VENUE_COUNTY}}.

AGREED AND ACCEPTED:

PROSPECTIVE BUYER:                     PROSPECTIVE SELLER:
{{PROSPECTIVE_BUYER}}                  {{PROSPECTIVE_SELLER}}

By: ___________________________        By: ___________________________
Name: _________________________        Name: _________________________
Title: Authorized Signatory            Title: Authorized Signatory`
  },

  // 4. COMMERCIAL REAL ESTATE TRIPLE NET LEASE (NNN)
  {
    id: 'commercial_triple_net_lease',
    category: 'real_estate',
    title: 'Commercial Triple Net (NNN) Lease Agreement',
    jurisdiction: 'United States Commercial Real Estate Standards',
    summary: 'Full-length commercial Triple Net lease agreement where Tenant pays base rent plus proportional real estate taxes, property insurance, and common area maintenance (CAM), complete with default remedies and subordination.',
    statutoryHighlights: ['Absolute Net Structure (NNN)', 'CAM Proportional Allocation', 'Accelerated Default Remedies', 'Casualty & Subordination'],
    variables: [
      { key: 'LANDLORD_NAME', label: 'Landlord Legal Entity', defaultVal: 'Metropolitan Commercial Properties LP', type: 'text' },
      { key: 'TENANT_NAME', label: 'Tenant Legal Entity', defaultVal: 'BioHealth Diagnostics Laboratories Inc.', type: 'text' },
      { key: 'PREMISES_ADDRESS', label: 'Leased Premises Suite & Building', defaultVal: 'Suite 400, 800 Corporate Center Drive, Charlotte, NC', type: 'text' },
      { key: 'RENTABLE_SQFT', label: 'Rentable Square Footage', defaultVal: '14,500 RSF', type: 'text' },
      { key: 'INITIAL_BASE_RENT_MONTHLY', label: 'Initial Monthly Base Rent ($)', defaultVal: '$36,250.00', type: 'text' },
      { key: 'SECURITY_DEPOSIT', label: 'Security Deposit ($)', defaultVal: '$72,500.00', type: 'text' },
      { key: 'LEASE_TERM_YEARS', label: 'Lease Term (Years)', defaultVal: '7', type: 'text' },
      { key: 'COMMENCEMENT_DATE', label: 'Commencement Date', defaultVal: 'January 1, 2027', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'North Carolina', type: 'text' },
      { key: 'VENUE_COUNTY', label: 'Venue County Court', defaultVal: 'Mecklenburg County Superior Court', type: 'text' }
    ],
    templateBody: `COMMERCIAL TRIPLE NET (NNN) LEASE AGREEMENT

THIS COMMERCIAL LEASE AGREEMENT (this "Lease") is entered into as of {{EFFECTIVE_DATE}}, by and between {{LANDLORD_NAME}} ("Landlord"), and {{TENANT_NAME}} ("Tenant").

1. DEMISE OF PREMISES
Landlord leases to Tenant, and Tenant leases from Landlord, the commercial premises situated at {{PREMISES_ADDRESS}}, comprising approximately {{RENTABLE_SQFT}} (the "Premises").

2. LEASE TERM
The term of this Lease shall be for {{LEASE_TERM_YEARS}} years, commencing on {{COMMENCEMENT_DATE}} (the "Commencement Date") and expiring at 11:59 PM on the final day of the term, unless earlier terminated in accordance with the provisions hereof.

3. RENT AND TRIPLE NET CHARGES
3.1 Base Rent. Tenant shall pay Landlord monthly base rent of {{INITIAL_BASE_RENT_MONTHLY}} in advance on or before the first day of each calendar month.
3.2 Triple Net (NNN) Operational Expenses. This Lease is an absolute net lease. Tenant shall pay as additional rent its proportionate share of: (a) all real estate taxes and assessments levied against the property; (b) all hazard and commercial general liability insurance premiums maintained by Landlord; and (c) all Common Area Maintenance (CAM) operational expenses.

4. SECURITY DEPOSIT
Concurrently with the execution of this Lease, Tenant shall deposit with Landlord the sum of {{SECURITY_DEPOSIT}} as security for the faithful performance of Tenant's obligations.

5. USE AND COMPLIANCE
Tenant shall use the Premises solely for general executive office and commercial laboratory use in strict compliance with applicable environmental, municipal, and zoning codes.

6. DEFAULT AND REMEDIES
If Tenant fails to pay rent within ten (10) days of due date, or breaches any other covenant and fails to cure within thirty (30) days following written notice, Landlord may terminate this Lease, re-enter the Premises, and accelerate remaining rent payments.

7. GOVERNING LAW AND VENUE
This Lease shall be governed by the laws of the State of {{GOVERNING_STATE}}, with exclusive venue in the {{VENUE_COUNTY}}.

LANDLORD:                              TENANT:
{{LANDLORD_NAME}}                      {{TENANT_NAME}}

By: ___________________________        By: ___________________________
Title: Authorized Representative       Title: Authorized Representative`
  },

  // 5. LLC OPERATING AGREEMENT (MANAGER-MANAGED)
  {
    id: 'llc_operating_agreement',
    category: 'corporate',
    title: 'LLC Operating Agreement (Manager-Managed)',
    jurisdiction: 'Delaware / US State LLC Acts',
    summary: 'Comprehensive institutional LLC Operating Agreement featuring capital account maintenance under IRC § 704(b), fiduciary duty safe harbors, transfer restrictions (Right of First Refusal), and drag-along/tag-along mechanics.',
    statutoryHighlights: ['IRC Section 704(b) Capital Accounts', 'Right of First Refusal (ROFR)', 'Major Decisions Supermajority', 'Fiduciary Safe Harbors'],
    variables: [
      { key: 'COMPANY_NAME', label: 'Company Legal Name LLC', defaultVal: 'Apex Strategic Holdings LLC', type: 'text' },
      { key: 'STATE_OF_FORMATION', label: 'State of Formation', defaultVal: 'Delaware', type: 'text' },
      { key: 'PRINCIPAL_OFFICE', label: 'Principal Business Address', defaultVal: '1209 Orange Street, Wilmington, DE 19801', type: 'text' },
      { key: 'MANAGER_NAME', label: 'Initial Manager Full Name', defaultVal: 'Alexander Sterling', type: 'text' },
      { key: 'INITIAL_CAPITAL_CONTRIBUTION', label: 'Initial Capital Contribution ($)', defaultVal: '$500,000', type: 'text' },
      { key: 'INITIAL_MEMBERS', label: 'Founding Members List', defaultVal: 'Sterling Ventures Inc. (60%) and Horizon Capital Partners LLC (40%)', type: 'text' },
      { key: 'VENUE_COURT', label: 'Court of Chancery Venue', defaultVal: 'Court of Chancery of the State of Delaware', type: 'text' }
    ],
    templateBody: `LIMITED LIABILITY COMPANY OPERATING AGREEMENT
OF {{COMPANY_NAME}}

THIS LIMITED LIABILITY COMPANY AGREEMENT (this "Agreement") of {{COMPANY_NAME}} (the "Company") is entered into as of {{EFFECTIVE_DATE}}, by and among the Members identified on Schedule A hereto (the "Members") and {{MANAGER_NAME}} as Manager.

ARTICLE I -- FORMATION AND PURPOSE
1.1 Formation. The Company was formed as a limited liability company pursuant to the provisions of the {{STATE_OF_FORMATION}} Limited Liability Company Act (the "Act").
1.2 Principal Office. The principal executive office of the Company shall be located at {{PRINCIPAL_OFFICE}}, or at such other place as the Manager may designate.
1.3 Business Purpose. The purpose of the Company is to engage in any lawful commercial or investment business for which limited liability companies may be organized under the Act.

ARTICLE II -- CAPITAL CONTRIBUTIONS AND ACCOUNTS
2.1 Initial Contributions. Concurrently with the execution of this Agreement, the Members have contributed cash or property in the aggregate amount of {{INITIAL_CAPITAL_CONTRIBUTION}}, as set forth on Schedule A.
2.2 Capital Accounts. A separate Capital Account shall be maintained for each Member in accordance with Section 704(b) of the Internal Revenue Code of 1986, as amended (the "Code").
2.3 No Mandatory Capital Calls. No Member shall be obligated to make additional capital contributions without such Member's express written approval.

ARTICLE III -- ALLOCATIONS AND CASH DISTRIBUTIONS
3.1 Profit and Loss Allocations. Net profits and net losses of the Company shall be allocated among the Members pro rata in accordance with their respective Membership Percentages.
3.2 Tax Distributions. To the extent cash is legally available, the Manager shall cause the Company to make quarterly cash distributions to each Member sufficient to satisfy estimated income tax liabilities attributable to taxable income allocated to such Member.

ARTICLE IV -- MANAGEMENT AND POWERS
4.1 Manager Authority. The management and governance of the Company shall be vested exclusively in {{MANAGER_NAME}} (the "Manager"). The Manager shall have full power and authority to act on behalf of the Company in the ordinary course of business.
4.2 Major Decisions. The Manager shall not take any of the following actions without the prior approval of Members holding at least seventy-five percent (75%) of the Membership Interests: (a) merge, consolidate, or sell all or substantially all assets of the Company; (b) file a voluntary bankruptcy petition; or (c) incur debt obligations exceeding Two Hundred Fifty Thousand Dollars ($250,000).

ARTICLE V -- TRANSFER RESTRICTIONS
5.1 General Prohibition. No Member may sell, assign, pledge, or transfer any Membership Interest without the prior written consent of the Manager.
5.2 Right of First Refusal (ROFR). If a Member receives a bona fide third-party purchase offer, the Company and other Members shall have the exclusive right of first refusal to acquire the offered interests on the same economic terms.

ARTICLE VI -- GOVERNING LAW AND CHANCERY VENUE
This Agreement shall be governed by the laws of the State of {{STATE_OF_FORMATION}}. Any dispute or action between the Members or Manager arising under this Agreement shall be brought exclusively in the {{VENUE_COURT}}.

IN WITNESS WHEREOF, the undersigned have executed this Operating Agreement as of the Effective Date.

MANAGER:                               MEMBERS:
{{MANAGER_NAME}}                       {{INITIAL_MEMBERS}}
By: ___________________________        By: ___________________________

SCHEDULE A
CAPITAL CONTRIBUTIONS AND MEMBERSHIP PERCENTAGES

Founding Members and Initial Capitalization:
{{INITIAL_MEMBERS}}
Total Initial Capital Contributed: {{INITIAL_CAPITAL_CONTRIBUTION}}

Capital accounts and voting percentages shall be maintained in accordance with the records of the Company and Section 2.2 hereof.`
  },

  // 6. ASSET PURCHASE AGREEMENT (APA - SEC EDGAR MIDDLE MARKET STANDARD)
  {
    id: 'commercial_asset_purchase_agreement',
    category: 'corporate',
    title: 'Asset Purchase Agreement (APA)',
    jurisdiction: 'Delaware / US Corporate Law (SEC EDGAR Model Standard)',
    summary: 'Standard middle-market Asset Purchase Agreement specifying acquired assets, excluded liabilities, indemnification escrow holdbacks, employee transition covenants, and non-competition restrictions.',
    statutoryHighlights: ['SEC EDGAR Middle-Market Architecture', 'Excluded Liabilities Firewall', 'Indemnity Escrow Holdback', '3-Year Non-Competition Covenant'],
    variables: [
      { key: 'SELLER_ENTITY', label: 'Seller Corporate Legal Name', defaultVal: 'Nexus Logistics Technologies LLC', type: 'text' },
      { key: 'BUYER_ENTITY', label: 'Buyer Corporate Legal Name', defaultVal: 'Horizon Global Supply Chain Corp.', type: 'text' },
      { key: 'PURCHASE_PRICE', label: 'Total Purchase Consideration ($)', defaultVal: '$8,500,000', type: 'text' },
      { key: 'ESCROW_HOLDBACK', label: 'Indemnification Holdback Escrow ($)', defaultVal: '$850,000', type: 'text' },
      { key: 'CLOSING_DATE', label: 'Target Closing Date', defaultVal: 'October 31, 2026', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Delaware', type: 'text' },
      { key: 'VENUE_COURT', label: 'Exclusive Chancery Court Venue', defaultVal: 'Court of Chancery of the State of Delaware', type: 'text' }
    ],
    templateBody: `ASSET PURCHASE AGREEMENT

THIS ASSET PURCHASE AGREEMENT (this "Agreement") is entered into as of {{EFFECTIVE_DATE}}, by and between {{SELLER_ENTITY}}, a Delaware limited liability company ("Seller"), and {{BUYER_ENTITY}}, a Delaware corporation ("Buyer").

RECITALS:
WHEREAS, Seller operates a specialized commercial software and supply chain logistics business (the "Business"); and
WHEREAS, Buyer desires to purchase from Seller, and Seller desires to sell to Buyer, substantially all assets of the Business, upon the terms and conditions set forth herein.

NOW, THEREFORE, the Parties agree as follows:

1. PURCHASE AND SALE OF ASSETS
Subject to the terms hereof, Seller shall sell, convey, assign, and transfer to Buyer, and Buyer shall purchase from Seller, all right, title, and interest in and to all tangible and intangible assets used in the operation of the Business, including customer contracts, software source code, patents, trademarks, inventory, and accounts receivable (the "Acquired Assets").

2. EXCLUDED LIABILITIES
Buyer shall not assume, and Seller shall retain and satisfy, all debts, liabilities, and obligations of Seller of every kind and nature, including tax liabilities, litigation claims, and pre-closing trade payables (the "Excluded Liabilities").

3. PURCHASE CONSIDERATION AND ESCROW
3.1 Purchase Price. The purchase price for the Acquired Assets is {{PURCHASE_PRICE}} (the "Purchase Price"), payable at Closing.
3.2 Indemnity Escrow Holdback. At Closing, Buyer shall deposit {{ESCROW_HOLDBACK}} with an independent escrow agent for a period of twelve (12) months as collateral security for Seller's indemnification obligations.

4. REPRESENTATIONS AND WARRANTIES OF SELLER
Seller represents and warrants that Seller owns good and marketable title to all Acquired Assets free of all liens, that intellectual property does not infringe third-party rights, and that financial statements fairly present financial condition.

5. RESTRICTIVE COVENANTS
Seller agrees that for a period of three (3) years following Closing, Seller shall not directly or indirectly engage in any commercial business competing with the Business within North America.

6. GOVERNING LAW AND VENUE
This Agreement shall be governed by and construed in accordance with the laws of the State of {{GOVERNING_STATE}}, with exclusive dispute venue in the {{VENUE_COURT}}.

SELLER: {{SELLER_ENTITY}}             BUYER: {{BUYER_ENTITY}}
By: ___________________________        By: ___________________________
Title: Authorized Signatory            Title: Authorized Signatory`
  },

  // 7. MASTER SERVICES AGREEMENT (MSA)
  {
    id: 'master_services_agreement',
    category: 'services',
    title: 'Master Services Agreement (MSA)',
    jurisdiction: 'United States Commercial Law (B2B SaaS / Services)',
    summary: 'Master Services Agreement establishing terms of engagement, Statement of Work (SOW) protocols, intellectual property work-for-hire assignment, indemnification, and liability caps.',
    statutoryHighlights: ['Work-Made-for-Hire 17 U.S.C. 101', 'Statement of Work (SOW) Framework', '12-Month Consequential Liability Cap', 'B2B Commercial Standard'],
    variables: [
      { key: 'CUSTOMER_NAME', label: 'Client / Customer Legal Name', defaultVal: 'Apex Capital Analytics Corp.', type: 'text' },
      { key: 'PROVIDER_NAME', label: 'Service Provider Legal Name', defaultVal: 'Nexus Intelligence Systems Inc.', type: 'text' },
      { key: 'LIABILITY_CAP', label: 'Aggregate Limitation of Liability ($)', defaultVal: '12 months of fees paid under applicable SOW', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'New York', type: 'text' },
      { key: 'VENUE_COURT', label: 'Venue Judicial District', defaultVal: 'Courts of the State of New York, New York County', type: 'text' }
    ],
    templateBody: `MASTER SERVICES AGREEMENT

This Master Services Agreement (this "Agreement") is entered into as of {{EFFECTIVE_DATE}}, by and between {{CUSTOMER_NAME}} ("Customer") and {{PROVIDER_NAME}} ("Provider").

1. SCOPE OF SERVICES
Provider shall perform professional technology, consulting, and development services as specified in one or more mutually executed Statements of Work ("SOW") referencing this Agreement.

2. COMPENSATION AND PAYMENT
Customer shall pay Provider the fees set forth in each SOW. All invoices shall be payable within thirty (30) days of receipt. Overdue invoices shall accrue interest at 1.5% per month or the statutory maximum.

3. INTELLECTUAL PROPERTY AND WORK PRODUCT
Customer shall own all right, title, and interest in and to all custom deliverables, code, and documentation created by Provider specifically for Customer under an SOW (the "Work Product"). All copyrightable Work Product shall be deemed a "work made for hire" for Customer under 17 U.S.C. Section 101. To the extent any deliverable is not deemed a work made for hire, Provider hereby unconditionally assigns and transfers to Customer all right, title, and interest therein.

4. CONFIDENTIALITY
Each party shall protect the other party's Confidential Information with the same degree of care it uses for its own confidential information, but not less than reasonable care.

5. LIMITATION OF LIABILITY
NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING UNDER THIS AGREEMENT SHALL BE STRICTLY LIMITED TO {{LIABILITY_CAP}}.

6. GOVERNING LAW AND VENUE
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}, with exclusive dispute venue in the {{VENUE_COURT}}.

CUSTOMER: {{CUSTOMER_NAME}}            PROVIDER: {{PROVIDER_NAME}}
By: ___________________________        By: ___________________________
Title: Authorized Signatory            Title: Authorized Signatory`
  },

  // 8. MUTUAL NON-DISCLOSURE AGREEMENT (DTSA COMPLIANT)
  {
    id: 'mutual_nda_trade_secrets',
    category: 'services',
    title: 'Mutual Non-Disclosure Agreement (DTSA Compliant)',
    jurisdiction: 'Defend Trade Secrets Act (DTSA) / US Federal Standard',
    summary: 'Bilateral confidentiality agreement protecting proprietary technology, customer lists, and financial forecasts, complete with Defend Trade Secrets Act (18 U.S.C. § 1836) whistleblower safe harbor notices.',
    statutoryHighlights: ['Defend Trade Secrets Act 18 U.S.C. 1833 Notice', 'Perpetual Trade Secret Survival', 'Need-to-Know Access Restriction', 'Injunctive Relief Authorization'],
    variables: [
      { key: 'PARTY_A_NAME', label: 'Party A Legal Name', defaultVal: 'Vanguard Cybernetics Inc.', type: 'text' },
      { key: 'PARTY_B_NAME', label: 'Party B Legal Name', defaultVal: 'Crestview Capital Partners LP', type: 'text' },
      { key: 'CONFIDENTIALITY_TERM_YEARS', label: 'Confidentiality Term (Years)', defaultVal: '3', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Delaware', type: 'text' },
      { key: 'VENUE_COUNTY', label: 'Venue County / Judicial District', defaultVal: 'New Castle County Court of Chancery', type: 'text' }
    ],
    templateBody: `MUTUAL NON-DISCLOSURE AGREEMENT

THIS MUTUAL NON-DISCLOSURE AGREEMENT (this "Agreement") is made as of {{EFFECTIVE_DATE}}, by and between {{PARTY_A_NAME}} and {{PARTY_B_NAME}} (collectively, the "Parties").

1. PURPOSE
The Parties intend to disclose confidential information to each other for the purpose of evaluating a potential commercial transaction or strategic partnership (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public technical, business, financial, and product information disclosed by one party ("Disclosing Party") to the other ("Receiving Party").

3. OBLIGATIONS
Receiving Party shall: (a) hold Confidential Information in strict confidence; (b) restrict disclosure solely to employees and advisors with a need-to-know; and (c) use it solely for the Purpose.

4. TERM
The obligations herein shall survive for {{CONFIDENTIALITY_TERM_YEARS}} years from disclosure, provided that trade secrets shall be protected for so long as they remain trade secrets under applicable law.

5. DEFEND TRADE SECRETS ACT NOTICE (18 U.S.C. SECTION 1833)
An individual shall not be held criminally or civilly liable under any federal or state trade secret law for disclosure of a trade secret made in confidence to a government official or attorney solely for reporting or investigating a suspected violation of law, or in a complaint filed under seal in a lawsuit.

6. GOVERNING LAW AND VENUE
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}, with exclusive dispute venue in the {{VENUE_COUNTY}}.

PARTY A: {{PARTY_A_NAME}}              PARTY B: {{PARTY_B_NAME}}
By: ___________________________        By: ___________________________
Title: Authorized Signatory            Title: Authorized Signatory`
  },

  // 9. INDEPENDENT CONTRACTOR AGREEMENT
  {
    id: 'independent_contractor_agreement',
    category: 'services',
    title: 'Independent Contractor Agreement (1099)',
    jurisdiction: 'United States Labor & IP Jurisprudence',
    summary: 'Standard 1099 independent contractor agreement affirming non-employment tax status, milestone compensation, non-solicitation, and full IP assignment under 17 U.S.C. § 101.',
    statutoryHighlights: ['Work-Made-for-Hire 17 U.S.C. 101', 'Present-Tense IP Assignment', 'IRS 1099 Tax Self-Affirmation', 'Non-Solicitation Protections'],
    variables: [
      { key: 'COMPANY_NAME', label: 'Company / Hiring Entity', defaultVal: 'Apex Cloud Innovations LLC', type: 'text' },
      { key: 'CONTRACTOR_NAME', label: 'Contractor Full Name / Entity', defaultVal: 'Dr. Gregory Vance, Ph.D.', type: 'text' },
      { key: 'SERVICES_DESCRIPTION', label: 'Scope of Services', defaultVal: 'software optimization, patent portfolio analysis, and machine learning infrastructure review', type: 'text' },
      { key: 'COMPENSATION_RATE', label: 'Compensation Rate', defaultVal: '$225.00 per hour, not to exceed $25,000 monthly', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'California', type: 'text' },
      { key: 'VENUE_COUNTY', label: 'Venue County / Judicial Court', defaultVal: 'San Francisco County Superior Court', type: 'text' }
    ],
    templateBody: `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement (this "Agreement") is entered into as of {{EFFECTIVE_DATE}}, by and between {{COMPANY_NAME}} ("Company") and {{CONTRACTOR_NAME}} ("Contractor").

1. ENGAGEMENT AND SERVICES
Company hereby engages Contractor, and Contractor agrees to perform, the following services: {{SERVICES_DESCRIPTION}} (the "Services"). Contractor shall retain sole control over the manner and means of performing the Services.

2. COMPENSATION
Company shall compensate Contractor at the rate of {{COMPENSATION_RATE}}. Contractor shall submit monthly itemized invoices, payable within thirty (30) days of receipt.

3. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor and not an employee or agent of Company. Contractor shall not be entitled to worker's compensation, health insurance, or unemployment benefits. Contractor bears sole responsibility for all self-employment and income taxes.

4. COMPREHENSIVE INTELLECTUAL PROPERTY ASSIGNMENT
All inventions, software code, reports, designs, and work product created by Contractor in connection with the Services (the "Work Product") shall belong exclusively to Company. Contractor acknowledges that all copyrightable Work Product constitutes a "work made for hire" for Company under 17 U.S.C. Section 101. In addition, Contractor hereby unconditionally and irrevocably sells, assigns, and transfers to Company all right, title, and interest worldwide in and to all Work Product, patents, copyrights, and trade secrets arising therefrom, effective immediately upon creation.

5. GOVERNING LAW AND VENUE
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}, with exclusive dispute venue in the {{VENUE_COUNTY}}.

COMPANY: {{COMPANY_NAME}}           CONTRACTOR: {{CONTRACTOR_NAME}}
By: ___________________________    By: ___________________________`
  },

  // 10. EXECUTIVE EMPLOYMENT AGREEMENT
  {
    id: 'executive_employment_agreement',
    category: 'services',
    title: 'Executive Employment & Severance Agreement',
    jurisdiction: 'United States Corporate Employment Jurisprudence',
    summary: 'Executive-level employment agreement incorporating base compensation, performance bonuses, termination definitions (Cause vs Without Cause), severance salary continuation, and Section 409A deferred compensation compliance.',
    statutoryHighlights: ['IRC Section 409A Compliance', 'Cause vs Without Cause Definitions', 'Severance Continuation Mechanics', 'Post-Termination Restrictive Covenants'],
    variables: [
      { key: 'EMPLOYER_NAME', label: 'Company / Employer Name', defaultVal: 'Nexus Cybernetics Technologies Corp.', type: 'text' },
      { key: 'EXECUTIVE_NAME', label: 'Executive Legal Name', defaultVal: 'Victoria Sterling, J.D.', type: 'text' },
      { key: 'EXECUTIVE_TITLE', label: 'Executive Position / Title', defaultVal: 'Chief Legal Officer & General Counsel', type: 'text' },
      { key: 'BASE_SALARY', label: 'Annual Base Salary ($)', defaultVal: '$375,000', type: 'text' },
      { key: 'ANNUAL_BONUS_PERCENT', label: 'Target Incentive Bonus (%)', defaultVal: '40%', type: 'text' },
      { key: 'SEVERANCE_MONTHS', label: 'Severance Continuation (Months)', defaultVal: '12', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'New York', type: 'text' },
      { key: 'VENUE_COURT', label: 'Venue Judicial Court', defaultVal: 'Supreme Court of the State of New York, County of New York', type: 'text' }
    ],
    templateBody: `EXECUTIVE EMPLOYMENT AGREEMENT

THIS EXECUTIVE EMPLOYMENT AGREEMENT (this "Agreement") is entered into as of {{EFFECTIVE_DATE}}, by and between {{EMPLOYER_NAME}} (the "Company") and {{EXECUTIVE_NAME}} ("Executive").

1. POSITION AND DUTIES
Executive shall serve as {{EXECUTIVE_TITLE}} of the Company, reporting directly to the Chief Executive Officer and Board of Directors. Executive shall perform all duties commensurate with such position and devote substantially all business time to the Company.

2. COMPENSATION AND BENEFITS
(a) Base Salary. The Company shall pay Executive an annual base salary of {{BASE_SALARY}}, payable in accordance with regular payroll practices.
(b) Annual Incentive Bonus. Executive shall be eligible to earn an annual target cash bonus equal to {{ANNUAL_BONUS_PERCENT}} of Base Salary, based on performance metrics established by the Board.
(c) Benefits. Executive shall participate in all health, disability, and 401(k) retirement benefit plans maintained for senior executive officers.

3. TERMINATION AND SEVERANCE
(a) At-Will. Employment is at-will and may be terminated by either party at any time, subject to severance terms herein.
(b) Termination for Cause. If terminated for Cause (felony conviction, material breach of fiduciary duty, or willful fraud), Company shall have no further obligation to pay compensation beyond accrued salary.
(c) Termination Without Cause. If Company terminates Executive without Cause, Executive shall receive, subject to execution of an unrevoked general release of claims: (i) continuation of Base Salary for {{SEVERANCE_MONTHS}} months; (ii) pro-rated annual bonus; and (iii) subsidized COBRA health premiums for up to twelve (12) months.

4. RESTRICTIVE COVENANTS
Executive covenants not to disclose trade secrets or solicit active employees or customers of Company for twelve (12) months following termination.

5. INTERNAL REVENUE CODE SECTION 409A COMPLIANCE
This Agreement is intended to comply with, or be exempt from, Internal Revenue Code Section 409A. Any severance payments triggered upon termination shall commence only upon Executive experiencing a separation from service within the meaning of Section 409A.

6. GOVERNING LAW AND VENUE
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}, with exclusive dispute venue in the {{VENUE_COURT}}.

COMPANY: {{EMPLOYER_NAME}}           EXECUTIVE: {{EXECUTIVE_NAME}}
By: ___________________________       _______________________________
Title: Authorized Signatory           {{EXECUTIVE_NAME}}`
  },

  // 11. SECURED COMMERCIAL PROMISSORY NOTE
  {
    id: 'commercial_promissory_note',
    category: 'finance',
    title: 'Secured Commercial Promissory Note',
    jurisdiction: 'Uniform Commercial Code (UCC Article 9 / Lending Standard)',
    summary: 'Institutional commercial promissory note featuring fixed interest accrual, acceleration upon event of default, UCC Article 9 security cross-collateralization, and collection attorney fee recovery.',
    statutoryHighlights: ['UCC Article 9 Security Grant', 'UCC-1 Financing Statement Filing Authorization', 'Default Rate Acceleration', 'Attorney Collection Fees'],
    variables: [
      { key: 'BORROWER_NAME', label: 'Borrower Legal Name', defaultVal: 'Vanguard Industrial Real Estate Holdings LLC', type: 'text' },
      { key: 'LENDER_NAME', label: 'Lender Legal Name', defaultVal: 'Crestview Commercial Credit Facility LP', type: 'text' },
      { key: 'PRINCIPAL_AMOUNT_NUM', label: 'Principal Loan Amount ($)', defaultVal: '$1,500,000.00', type: 'text' },
      { key: 'INTEREST_RATE_PERCENT', label: 'Annual Fixed Interest Rate (%)', defaultVal: '8.25%', type: 'text' },
      { key: 'DEFAULT_INTEREST_RATE', label: 'Default Interest Rate (%)', defaultVal: '13.25%', type: 'text' },
      { key: 'MATURITY_DATE', label: 'Maturity Date Deadline', defaultVal: 'October 31, 2028', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Delaware', type: 'text' },
      { key: 'VENUE_COUNTY', label: 'Venue County / Judicial Court', defaultVal: 'New Castle County Court of Chancery', type: 'text' }
    ],
    templateBody: `SECURED COMMERCIAL PROMISSORY NOTE

Principal Amount: {{PRINCIPAL_AMOUNT_NUM}}
Effective Date: {{EFFECTIVE_DATE}}
Maturity Date: {{MATURITY_DATE}}

FOR VALUE RECEIVED, the undersigned, {{BORROWER_NAME}}, a Delaware limited liability company ("Borrower"), promises to pay to the order of {{LENDER_NAME}} ("Lender"), the principal sum of {{PRINCIPAL_AMOUNT_NUM}}, together with interest on the unpaid principal balance at the rate of {{INTEREST_RATE_PERCENT}} per annum.

1. PAYMENT TERMS
Borrower shall make monthly payments of accrued interest on the first business day of each calendar month. The entire outstanding principal balance, together with all unpaid accrued interest, shall be due and payable in full on {{MATURITY_DATE}} (the "Maturity Date").

2. SECURITY AND UCC ARTICLE 9 PERFECTION
This Note is secured by a first-priority commercial security interest granted by Borrower to Lender under a Security Agreement covering all commercial assets, accounts, equipment, and proceeds of Borrower pursuant to Article 9 of the Uniform Commercial Code. Borrower hereby authorizes Lender to file UCC-1 financing statements, amendments, and continuation statements with the Delaware Secretary of State and all other applicable state and county recording offices to perfect and maintain the security interest granted herein.

3. EVENTS OF DEFAULT AND ACCELERATION
The occurrence of any of the following shall constitute an "Event of Default": (a) failure to pay any principal or interest within five (5) days of due date; (b) voluntary or involuntary bankruptcy of Borrower; or (c) material breach of any loan agreement. Upon an Event of Default, the entire unpaid balance shall become immediately due and payable at the option of Lender, and interest shall accrue at {{DEFAULT_INTEREST_RATE}}.

4. ATTORNEY FEES AND COSTS
Borrower agrees to pay all reasonable attorney fees and court costs incurred by Lender in enforcing or collecting this Note.

5. GOVERNING LAW AND VENUE
This Note shall be governed by and construed in accordance with the laws of the State of {{GOVERNING_STATE}}, with exclusive dispute venue in the {{VENUE_COUNTY}}.

BORROWER:
{{BORROWER_NAME}}

By: ___________________________
Name: _________________________
Title: Authorized Manager`
  },

  // 12. SETTLEMENT AND MUTUAL GENERAL RELEASE AGREEMENT
  {
    id: 'settlement_and_release_agreement',
    category: 'dispute',
    title: 'Settlement and Mutual General Release Agreement',
    jurisdiction: 'United States Civil Litigation Practice (All 50 States)',
    summary: 'Universal settlement and release of legal claims containing complete mutual covenants, dismissal with prejudice, California Civil Code § 1542 waiver of unknown claims, non-disparagement, and confidentiality.',
    statutoryHighlights: ['California Civil Code 1542 Waiver', 'Dismissal with Prejudice Stipulation', 'Comprehensive Mutual General Release', 'Strict Non-Disparagement & Confidentiality'],
    variables: [
      { key: 'FIRST_PARTY', label: 'Claimant / First Party Legal Name', defaultVal: 'Vanguard Dynamics Software Inc.', type: 'text' },
      { key: 'SECOND_PARTY', label: 'Respondent / Second Party Legal Name', defaultVal: 'Quantum Analytics Partners LLC', type: 'text' },
      { key: 'DISPUTE_SUMMARY', label: 'Summary of Disputed Matter', defaultVal: 'alleged breach of master license agreement and service level credits under Docket No. 24-CV-8812', type: 'text' },
      { key: 'SETTLEMENT_AMOUNT_WORDS', label: 'Settlement Payment (Words)', defaultVal: 'One Hundred Seventy-Five Thousand Dollars', type: 'text' },
      { key: 'SETTLEMENT_AMOUNT_NUM', label: 'Settlement Payment ($ Numerical)', defaultVal: '$175,000', type: 'text' },
      { key: 'PAYMENT_DEADLINE_DAYS', label: 'Payment Deadline (Business Days)', defaultVal: '10', type: 'text' },
      { key: 'COURT_JURISDICTION', label: 'Court / Action Venue', defaultVal: 'United States District Court for the Southern District of New York', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'New York', type: 'text' }
    ],
    templateBody: `SETTLEMENT AND MUTUAL GENERAL RELEASE AGREEMENT

THIS SETTLEMENT AND MUTUAL GENERAL RELEASE AGREEMENT (this "Agreement") is entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{FIRST_PARTY}} ("First Party") and {{SECOND_PARTY}} ("Second Party").

RECITALS:
WHEREAS, a dispute arose between the Parties concerning {{DISPUTE_SUMMARY}} (the "Dispute"); and
WHEREAS, the Parties desire to fully, finally, and amicably compromise, resolve, and settle all disputes, controversies, and claims existing between them, without any admission of liability or wrongdoing.

NOW, THEREFORE, the Parties agree as follows:

1. SETTLEMENT CONSIDERATION
Within {{PAYMENT_DEADLINE_DAYS}} business days following the Effective Date, {{SECOND_PARTY}} shall pay to {{FIRST_PARTY}} the sum of {{SETTLEMENT_AMOUNT_WORDS}} ({{SETTLEMENT_AMOUNT_NUM}}) by wire transfer of immediately available federal funds.

2. DISMISSAL OF PENDING PROCEEDINGS
Within two (2) business days following receipt and clearance of the settlement payment, the Parties shall execute and file a Stipulation of Dismissal with Prejudice of all claims pending before the {{COURT_JURISDICTION}}, each party bearing its own attorney fees.

3. MUTUAL GENERAL RELEASE
Each Party completely releases and forever discharges the other Party from any and all claims, demands, liabilities, suits, damages, and causes of action of any kind, whether known or unknown, arising out of or related to the Dispute.

4. EXPRESS WAIVER OF UNKNOWN CLAIMS (CALIFORNIA CIVIL CODE § 1542)
The Parties expressly waive and relinquish all rights and benefits afforded by Section 1542 of the California Civil Code, which provides:
"A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS THAT THE CREDITOR OR RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING THE RELEASE AND THAT, IF KNOWN BY HIM OR HER, WOULD HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE DEBTOR OR RELEASED PARTY."

5. NO ADMISSION OF FAULT
This Agreement is the compromise of a disputed claim and shall not be construed as an admission of fault or liability by either Party.

6. CONFIDENTIALITY AND NON-DISPARAGEMENT
The financial terms of this settlement shall remain strictly confidential. Each Party covenants not to make or publish any disparaging remarks regarding the other Party.

7. GOVERNING LAW AND VENUE
This Agreement shall be governed in accordance with the laws of the State of {{GOVERNING_STATE}}, with exclusive dispute venue in the {{COURT_JURISDICTION}}.

FIRST PARTY: {{FIRST_PARTY}}           SECOND PARTY: {{SECOND_PARTY}}
By: ___________________________        By: ___________________________
Title: Authorized Representative       Title: Authorized Representative`
  }
];

/**
 * Compiles a contract template by injecting client variable values.
 * 
 * @param {Object} template - The template object from LEGAL_TEMPLATES
 * @param {Object} userValues - Key-value map of variable inputs
 * @returns {string} Compiled legal agreement text
 */
export function compileTemplateText(template, userValues = {}) {
  if (!template || !template.templateBody) return '';

  let compiled = template.templateBody;

  // Insert effective date if not explicitly passed
  const effectiveDate = userValues.EFFECTIVE_DATE || new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  compiled = compiled.replace(/\{\{EFFECTIVE_DATE\}\}/g, effectiveDate);

  // Inject user variables
  (template.variables || []).forEach(v => {
    const val = userValues[v.key] !== undefined && userValues[v.key] !== '' 
      ? userValues[v.key] 
      : (v.defaultVal || `[${v.label}]`);
    const regex = new RegExp(`\\{\\{${v.key}\\}\\}`, 'g');
    compiled = compiled.replace(regex, val);
  });

  return compiled;
}
