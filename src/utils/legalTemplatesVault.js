/**
 * Nexus ContractGuard Enterprise — AmLaw 100 Legal Contract Templates Vault
 * Standardized institutional US legal agreements complying with Delaware General Corporation Law,
 * Uniform Commercial Code (UCC), Restatement (Second) of Contracts, and American Real Estate Practice.
 */

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates', labelAr: 'جميع الصيغ' },
  { id: 'real_estate', label: 'Real Estate & Land', labelAr: 'العقارات والأراضي' },
  { id: 'corporate', label: 'Corporate & M&A', labelAr: 'الشركات والاستحواذ' },
  { id: 'services', label: 'Commercial & Tech', labelAr: 'الخدمات والتكنولوجيا' },
  { id: 'finance', label: 'Lending & Finance', labelAr: 'التمويل والقروض' }
];

export const LEGAL_TEMPLATES = [
  // 1. COMMERCIAL LAND PURCHASE AND SALE AGREEMENT (PSA)
  {
    id: 'commercial_land_psa',
    category: 'real_estate',
    title: 'Commercial Land Purchase and Sale Agreement',
    titleAr: 'عقد بيع وشراء أرض تجارية (Commercial Land PSA)',
    jurisdiction: 'United States Real Property Jurisprudence (State Specific)',
    summary: 'Institutional agreement for the purchase and conveyance of fee simple commercial land and parcels, complete with earnest money escrow, environmental inspection contingencies, title commitments, FIRPTA compliance, and liquidated damages provisions.',
    variables: [
      { key: 'SELLER_NAME', label: 'Seller Full Legal Name', defaultVal: 'Midwest Industrial Land Holdings LLC', type: 'text' },
      { key: 'SELLER_STATE', label: 'Seller State of Formation', defaultVal: 'Delaware', type: 'text' },
      { key: 'BUYER_NAME', label: 'Buyer Full Legal Name', defaultVal: 'Apex Horizon Real Estate Ventures LLC', type: 'text' },
      { key: 'BUYER_STATE', label: 'Buyer State of Formation', defaultVal: 'Delaware', type: 'text' },
      { key: 'PROPERTY_ADDRESS', label: 'Property Street Address / Location', defaultVal: '1420 Technology Parkway, Industrial Park District', type: 'text' },
      { key: 'COUNTY_STATE', label: 'County & State of Property', defaultVal: 'Franklin County, State of Ohio', type: 'text' },
      { key: 'PARCEL_ID', label: 'Parcel APN / Tax ID Number', defaultVal: 'APN-884-902-114', type: 'text' },
      { key: 'ACREAGE', label: 'Approximate Land Area (Acres/SqFt)', defaultVal: '12.45 Gross Acres', type: 'text' },
      { key: 'PURCHASE_PRICE_WORDS', label: 'Purchase Price (Written Words)', defaultVal: 'Two Million Four Hundred Fifty Thousand Dollars', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Purchase Price ($ Numerical)', defaultVal: '$2,450,000', type: 'text' },
      { key: 'DEPOSIT_AMOUNT', label: 'Earnest Money Deposit ($)', defaultVal: '$100,000', type: 'text' },
      { key: 'ESCROW_AGENT', label: 'Title Company & Escrow Agent', defaultVal: 'First American Title Insurance Company', type: 'text' },
      { key: 'STUDY_PERIOD_DAYS', label: 'Due Diligence Period (Days)', defaultVal: '45', type: 'text' },
      { key: 'CLOSING_DATE', label: 'Closing Date Deadline', defaultVal: 'December 15, 2026', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Ohio', type: 'text' }
    ],
    templateBody: `COMMERCIAL LAND PURCHASE AND SALE AGREEMENT

THIS COMMERCIAL LAND PURCHASE AND SALE AGREEMENT (this "Agreement") is entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{SELLER_NAME}}, a {{SELLER_STATE}} limited liability company ("Seller"), and {{BUYER_NAME}}, a {{BUYER_STATE}} limited liability company ("Buyer").

RECITALS:
WHEREAS, Seller is the sole lawful fee simple owner of that certain unimproved parcel of real property situated at {{PROPERTY_ADDRESS}}, located within {{COUNTY_STATE}}, designated as Tax Parcel Identification Number {{PARCEL_ID}}, consisting of approximately {{ACREAGE}}, as more particularly bounded and described in Exhibit A attached hereto (the "Land"); and
WHEREAS, Buyer desires to acquire from Seller, and Seller desires to sell and convey to Buyer, fee simple title to the Land, together with all hereditaments, easements, appurtenances, and development entitlements running therewith, upon the terms and conditions set forth herein.

NOW, THEREFORE, for good and valuable consideration, the mutual receipt and adequacy of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I — PURCHASE CONSIDERATION & ESCROW DEPOSIT
1.1 Purchase Price. The agreed total purchase consideration for the Land shall be {{PURCHASE_PRICE_WORDS}} ({{PURCHASE_PRICE_NUM}}) (the "Purchase Price"), payable by wire transfer of immediately available United States federal reserve funds at the Closing.
1.2 Earnest Money Deposit. Within three (3) business days following mutual execution of this Agreement, Buyer shall deposit with {{ESCROW_AGENT}} (the "Escrow Agent") the sum of {{DEPOSIT_AMOUNT}} (together with all interest accrued thereon, the "Deposit"). The Deposit shall be held in an interest-bearing escrow account and applied toward the Purchase Price at Closing.
1.3 Independent Consideration. One Hundred Dollars ($100.00) of the Deposit shall be non-refundable and immediately delivered to Seller as independent commercial consideration for Buyer's exclusive option to inspect and purchase.

ARTICLE II — DUE DILIGENCE & INSPECTION CONTINGENCIES
2.1 Due Diligence Period. Buyer shall have a period of {{STUDY_PERIOD_DAYS}} calendar days commencing on the Effective Date (the "Due Diligence Period") to enter upon the Land, conduct environmental assessments (including Phase I/II Environmental Site Assessments), geotechnical soil tests, wetland delineations, zoning audits, and utility capacity verifications.
2.2 Right of Termination. If Buyer determines, in Buyer's sole and absolute discretion, that the Land is unsuitable for Buyer's intended commercial development, Buyer may terminate this Agreement by delivering written notice of termination to Seller and Escrow Agent prior to 5:00 PM EST on the final day of the Due Diligence Period. Upon timely delivery of such notice, Escrow Agent shall promptly return the entire Deposit to Buyer without requirement of Seller's consent, and neither Party shall have further rights or obligations hereunder, except for surviving indemnities.

ARTICLE III — TITLE EXAMINATION & SURVEY
3.1 Title Commitment. Within ten (10) days of the Effective Date, Seller shall cause Escrow Agent to issue and deliver to Buyer a current ALTA title commitment for an owner's policy of title insurance in the amount of the Purchase Price, together with legible copies of all recorded instruments constituting exceptions to title.
3.2 Title Objections. Buyer shall have until fifteen (15) days prior to the expiration of the Due Diligence Period to notify Seller in writing of any title defects or encumbrances to which Buyer objects. Seller shall have five (5) days following receipt to elect whether to cure such defects. All mortgage liens, tax liens, and monetary encumbrances created by Seller shall be satisfied and discharged by Seller at or prior to Closing without exception.

ARTICLE IV — REPRESENTATIONS AND WARRANTIES OF SELLER
Seller hereby represents, warrants, and covenants to Buyer as of the Effective Date and as of the Closing Date as follows:
(a) Authority. Seller has full corporate power, legal authority, and organizational capacity to enter into and perform this Agreement without violating any court order, organizational charter, or contractual covenant.
(b) Fee Simple Title. Seller owns marketable, unencumbered fee simple legal title to the Land, subject only to permitted title exceptions accepted in writing by Buyer.
(c) Environmental Compliance. To Seller's actual knowledge, no hazardous substances, toxic chemicals, or underground storage tanks are present on or beneath the Land in violation of Comprehensive Environmental Response, Compensation, and Liability Act (CERCLA) or applicable state environmental protection statutes.
(d) Condemnation. There are no pending or threatened condemnation, eminent domain, or special assessment proceedings affecting any portion of the Land.

ARTICLE V — CLOSING MECHANICS & DELIVERIES
5.1 Closing Date. The closing of the transaction contemplated hereby (the "Closing") shall take place through escrow with the Escrow Agent on or prior to {{CLOSING_DATE}} (the "Closing Date"), unless mutually extended in writing by the Parties.
5.2 Seller Deliveries. At Closing, Seller shall execute and deliver into escrow:
  (i) A Special Warranty Deed conveying marketable fee simple title to the Land to Buyer;
  (ii) A FIRPTA Non-Foreign Person Certification in compliance with Internal Revenue Code § 1445;
  (iii) An ALTA Owner's Title Affidavit establishing absence of unrecorded mechanic's liens; and
  (iv) A closing statement executed by Seller detailing all disbursements and proration credits.
5.3 Buyer Deliveries. At Closing, Buyer shall deliver into escrow the balance of the Purchase Price, less credit for the Deposit and applicable prorations, together with Buyer's executed counterpart closing statement.
5.4 Prorations. Real estate taxes, special assessments, and drainage dues for the current calendar year shall be prorated between Buyer and Seller as of 11:59 PM on the day immediately preceding the Closing Date based upon the most recent tax duplicates.

ARTICLE VI — DEFAULT & REMEDIES
6.1 Buyer Default. IN THE EVENT BUYER MATERIALLY BREACHES THIS AGREEMENT FOLLOWING EXPIRATION OF APPLICABLE CURE PERIODS, SELLER'S SOLE AND EXCLUSIVE REMEDY SHALL BE TO RECEIVE AND RETAIN THE EARNEST MONEY DEPOSIT AS FULL LIQUIDATED DAMAGES, THE PARTIES ACKNOWLEDGING THAT SELLER'S ACTUAL DAMAGES IN THE EVENT OF BUYER'S DEFAULT ARE IMPOSSIBLE TO CALCULATE PRECISELY AND THAT SUCH AMOUNT REPRESENTS A FAIR AND REASONABLE PRE-ESTIMATE OF SELLER'S LOSS.
6.2 Seller Default. In the event Seller fails or refuses to convey the Land in accordance with this Agreement, Buyer shall have the right to either: (a) terminate this Agreement, receive an immediate refund of the Deposit, and recover Buyer's actual out-of-pocket due diligence expenses up to $25,000; or (b) initiate an action for specific performance to compel conveyance of the Land.

ARTICLE VII — MISCELLANEOUS
7.1 Governing Law. This Agreement shall be construed, interpreted, and governed in accordance with the substantive laws of the State of {{GOVERNING_STATE}}, without regard to conflicts of law principles.
7.2 Integration & Counterparts. This Agreement constitutes the complete and exclusive agreement between the Parties regarding the Land. This instrument may be executed in counterparts, each of which shall be deemed an original, and electronic signatures shall have equal legal dignity and effect pursuant to the Uniform Electronic Transactions Act (UETA) and the federal E-SIGN Act.

IN WITNESS WHEREOF, the Parties hereto have executed this Commercial Land Purchase and Sale Agreement as of the date first above written.

SELLER:
{{SELLER_NAME}}, a {{SELLER_STATE}} limited liability company

By: _________________________________________
Name: [Authorized Signatory]
Title: Managing Member / Authorized Officer

BUYER:
{{BUYER_NAME}}, a {{BUYER_STATE}} limited liability company

By: _________________________________________
Name: [Authorized Signatory]
Title: Managing Member / Authorized Officer`
  },

  // 2. RESIDENTIAL REAL PROPERTY PURCHASE CONTRACT
  {
    id: 'residential_real_estate_contract',
    category: 'real_estate',
    title: 'Residential Real Property Purchase Agreement',
    titleAr: 'عقد بيع وشراء عقار سكني (Residential Purchase Agreement)',
    jurisdiction: 'Standard US Residential Conveyance Standards',
    summary: 'Comprehensive residential real estate contract incorporating financing contingencies, home inspection periods, appraisal thresholds, lead-based paint disclosures, and marketable title conveyances.',
    variables: [
      { key: 'SELLER_NAME', label: 'Seller Full Name', defaultVal: 'Jonathan E. Davis and Sarah M. Davis', type: 'text' },
      { key: 'BUYER_NAME', label: 'Buyer Full Name', defaultVal: 'Marcus Sterling and Elena Sterling', type: 'text' },
      { key: 'PROPERTY_ADDRESS', label: 'Residential Property Address', defaultVal: '742 Evergreen Terrace, Springfield', type: 'text' },
      { key: 'PURCHASE_PRICE_WORDS', label: 'Purchase Price (Words)', defaultVal: 'Seven Hundred Eighty-Five Thousand Dollars', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Purchase Price ($ Numerical)', defaultVal: '$785,000', type: 'text' },
      { key: 'EARNEST_DEPOSIT', label: 'Earnest Money ($)', defaultVal: '$25,000', type: 'text' },
      { key: 'FINANCING_CONTINGENCY_DAYS', label: 'Mortgage Contingency Period (Days)', defaultVal: '30', type: 'text' },
      { key: 'INSPECTION_DAYS', label: 'Inspection Period (Days)', defaultVal: '14', type: 'text' },
      { key: 'CLOSING_DATE', label: 'Closing Date', defaultVal: 'November 20, 2026', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing State Law', defaultVal: 'Illinois', type: 'text' }
    ],
    templateBody: `RESIDENTIAL REAL PROPERTY PURCHASE AGREEMENT

1. PARTIES & PROPERTY
This Agreement is entered into on {{EFFECTIVE_DATE}}, by and between {{SELLER_NAME}} ("Seller") and {{BUYER_NAME}} ("Buyer"). Seller agrees to sell and Buyer agrees to purchase the residential real property located at {{PROPERTY_ADDRESS}} (the "Property"), together with all attached fixtures, plumbing, electrical systems, and landscaping.

2. PURCHASE CONSIDERATION
The Purchase Price for the Property is {{PURCHASE_PRICE_WORDS}} ({{PURCHASE_PRICE_NUM}}). Buyer shall tender an earnest money deposit of {{EARNEST_DEPOSIT}} within two (2) business days following mutual execution, with the remaining balance payable by certified cashier's check or wire transfer at Closing.

3. FINANCING CONTINGENCY
Buyer's obligations are conditioned upon Buyer securing a conventional institutional mortgage loan commitment within {{FINANCING_CONTINGENCY_DAYS}} days from the Effective Date, in an amount of not less than eighty percent (80%) of the Purchase Price at prevailing market rates. If Buyer cannot obtain financing despite diligent good faith effort, Buyer may terminate this Agreement and receive full refund of the earnest money.

4. PROPERTY INSPECTION & DISCLOSURES
Buyer shall have {{INSPECTION_DAYS}} calendar days following the Effective Date to conduct professional structural, mechanical, environmental (radon, lead, mold, pest) inspections. If significant safety or structural defects are discovered, Buyer may request repairs, credits, or terminate this contract with full earnest money return.

5. TITLE & CONVEYANCE
Seller shall convey marketable fee simple title to Buyer by General Warranty Deed, free and clear of all liens and encumbrances except current ad valorem taxes and standard utility easements of record.

6. CLOSING & GOVERNING LAW
Closing shall take place on or before {{CLOSING_DATE}}. This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}.

SELLER: _______________________    BUYER: _______________________
Date: {{EFFECTIVE_DATE}}           Date: {{EFFECTIVE_DATE}}`
  },

  // 3. MASTER SERVICES AGREEMENT (MSA)
  {
    id: 'master_services_agreement',
    category: 'services',
    title: 'Master Services Agreement (MSA) with IP Assignment',
    titleAr: 'اتفاقية تقديم خدمات رئيسية ونقل الملكية الفكرية (MSA)',
    jurisdiction: 'Delaware Commercial Law / AmLaw 100 Standards',
    summary: 'Definitive commercial enterprise services contract containing Statements of Work (SOW) architecture, strict Work-Made-For-Hire intellectual property assignments under 17 U.S.C. § 101, mutual indemnification caps, and Delaware choice of law.',
    variables: [
      { key: 'CLIENT_NAME', label: 'Client Corporate Entity', defaultVal: 'Nexus Enterprise Systems Inc.', type: 'text' },
      { key: 'CLIENT_STATE', label: 'Client State of Formation', defaultVal: 'Delaware', type: 'text' },
      { key: 'PROVIDER_NAME', label: 'Service Provider Legal Entity', defaultVal: 'Vanguard Cyber Technologies LLC', type: 'text' },
      { key: 'PROVIDER_STATE', label: 'Provider State of Formation', defaultVal: 'California', type: 'text' },
      { key: 'PAYMENT_TERMS_DAYS', label: 'Invoice Payment Terms (Net Days)', defaultVal: '30', type: 'text' },
      { key: 'LIABILITY_CAP_MULTIPLIER', label: 'Liability Cap (x Total Fees Paid)', defaultVal: 'Two (2) times', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Delaware', type: 'text' }
    ],
    templateBody: `MASTER SERVICES AGREEMENT (MSA)

This Master Services Agreement (this "Agreement") is made effective as of {{EFFECTIVE_DATE}}, by and between {{CLIENT_NAME}}, a {{CLIENT_STATE}} corporation ("Client"), and {{PROVIDER_NAME}}, a {{PROVIDER_STATE}} limited liability company ("Provider").

1. SERVICES & STATEMENTS OF WORK (SOW)
Provider shall perform commercial and technology consulting services as specified in one or more mutually executed Statements of Work (each, an "SOW"). Each SOW shall constitute an independent agreement incorporating the general terms and conditions of this Agreement.

2. COMPENSATION & INVOICING
Client shall pay Provider the fees set forth in each applicable SOW. Invoices shall be rendered monthly and payable within {{PAYMENT_TERMS_DAYS}} calendar days from receipt of a valid, undisputed invoice. Any disputed amounts shall be raised in writing within fifteen (15) days of receipt.

3. OWNERSHIP & INTELLECTUAL PROPERTY ASSIGNMENT
All software code, documentation, reports, inventions, algorithms, and works of authorship created or developed by Provider specifically for Client under any SOW (the "Deliverables") shall be deemed "works made for hire" for Client under the United States Copyright Act (17 U.S.C. § 101 et seq.). To the extent any Deliverable fails to qualify as a work made for hire, Provider hereby irrevocably sells, conveys, and assigns to Client all right, title, and interest in and to such Deliverable, including all patent, trademark, and trade secret protections.

4. CONFIDENTIALITY
Each Party shall protect and preserve the confidentiality of all non-public technical, commercial, and financial information disclosed by the other Party, using at least the same degree of care it exercises with respect to its own highly sensitive data, and in no event less than reasonable care.

5. LIMITATION OF LIABILITY
EXCEPT FOR CLAIMS ARISING OUT OF WILLFUL MISCONDUCT, GROSS NEGLIGENCE, OR BREACH OF ARTICLE 3 (INTELLECTUAL PROPERTY), NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF THIS AGREEMENT SHALL BE STRICTLY LIMITED TO {{LIABILITY_CAP_MULTIPLIER}} THE AGGREGATE FEES PAID OR PAYABLE BY CLIENT UNDER THE APPLICABLE SOW DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

6. GOVERNING LAW & JURISDICTION
This Agreement shall be construed and enforced in accordance with the laws of the State of {{GOVERNING_STATE}}, without regard to conflict of laws principles. The Parties consent to the exclusive jurisdiction and venue of the state and federal courts located in {{GOVERNING_STATE}}.

IN WITNESS WHEREOF, the Parties have executed this Master Services Agreement.

CLIENT: {{CLIENT_NAME}}
By: ___________________________ Name: [Authorized Officer] Title: VP / Director

PROVIDER: {{PROVIDER_NAME}}
By: ___________________________ Name: [Authorized Officer] Title: Managing Principal`
  },

  // 4. MUTUAL NON-DISCLOSURE AGREEMENT (NDA)
  {
    id: 'mutual_nda_trade_secrets',
    category: 'corporate',
    title: 'Mutual Non-Disclosure Agreement (Trade Secrets & DTSA)',
    titleAr: 'اتفاقية سرية وحماية الأسرار التجارية (Mutual NDA & DTSA)',
    jurisdiction: 'Defend Trade Secrets Act (18 U.S.C. § 1836) / Delaware Law',
    summary: 'Standard institutional two-way NDA with Defend Trade Secrets Act (DTSA) whistleblower immunity carveouts, non-solicitation covenants, non-circumvention, and 3-year term.',
    variables: [
      { key: 'PARTY_A_NAME', label: 'Disclosing Party A Full Legal Name', defaultVal: 'Aegis BioTech Holdings Inc.', type: 'text' },
      { key: 'PARTY_B_NAME', label: 'Disclosing Party B Full Legal Name', defaultVal: 'Meridian Capital Partners LLC', type: 'text' },
      { key: 'PURPOSE_DESCRIPTION', label: 'Business Transaction Evaluation Purpose', defaultVal: 'evaluating a potential strategic acquisition, joint venture, or financing transaction', type: 'text' },
      { key: 'TERM_YEARS', label: 'Confidentiality Term (Years)', defaultVal: '3', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Delaware', type: 'text' }
    ],
    templateBody: `MUTUAL CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT

This Mutual Confidentiality and Non-Disclosure Agreement (the "Agreement") is made effective as of {{EFFECTIVE_DATE}}, by and between {{PARTY_A_NAME}} ("Party A") and {{PARTY_B_NAME}} ("Party B").

1. PURPOSE
The Parties wish to exchange confidential business, financial, and technical information solely for the purpose of {{PURPOSE_DESCRIPTION}} (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" refers to any proprietary information disclosed by one Party ("Disclosing Party") to the other ("Receiving Party"), whether orally, electronically, or in writing, that is marked as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

3. OBLIGATIONS OF RECEIVING PARTY
Receiving Party agrees to:
(a) Protect Confidential Information with the same degree of care it uses for its own confidential data (minimum reasonable care);
(b) Restrict access solely to its officers, directors, attorneys, and financial advisors who need to know such information for the Purpose and who are bound by confidentiality covenants; and
(c) Not copy, decompile, reverse-engineer, or commercially exploit Confidential Information.

4. STATUTORY TRADE SECRET NOTICE (DTSA)
Pursuant to the Defend Trade Secrets Act of 2016 (18 U.S.C. § 1833(b)), an individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that is made in confidence to a government official or to an attorney solely for the purpose of reporting or investigating a suspected violation of law.

5. DURATION & RETURN
The obligations of confidentiality shall endure for a period of {{TERM_YEARS}} years following disclosure; provided, that trade secrets shall remain confidential for so long as they retain trade secret status under applicable law. Upon written demand, Receiving Party shall return or certify destruction of all Confidential Information.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}.

PARTY A: {{PARTY_A_NAME}}          PARTY B: {{PARTY_B_NAME}}
By: ___________________________    By: ___________________________`
  },

  // 5. COMMERCIAL ASSET PURCHASE AGREEMENT (APA)
  {
    id: 'commercial_asset_purchase_agreement',
    category: 'corporate',
    title: 'Commercial Asset Purchase Agreement (APA)',
    titleAr: 'عقد شراء أصول تجارية وصفقة استحواذ (Asset Purchase Agreement)',
    jurisdiction: 'Delaware Court of Chancery & UCC Article 2/6 Standards',
    summary: 'Full M&A asset purchase agreement with schedule disclosure requirements, transfer of intellectual property, excluded liabilities carveouts, closing escrow, and indemnification caps.',
    variables: [
      { key: 'SELLER_ENTITY', label: 'Seller Legal Entity', defaultVal: 'OmniCorp Dynamics LLC', type: 'text' },
      { key: 'BUYER_ENTITY', label: 'Buyer Legal Entity', defaultVal: 'Titan Acquisition Group Inc.', type: 'text' },
      { key: 'PURCHASE_PRICE_WORDS', label: 'Purchase Consideration (Words)', defaultVal: 'Three Million Five Hundred Thousand Dollars', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Purchase Consideration ($)', defaultVal: '$3,500,000', type: 'text' },
      { key: 'ESCROW_HOLDBACK', label: 'Indemnity Escrow Holdback ($)', defaultVal: '$350,000', type: 'text' },
      { key: 'CLOSING_DATE', label: 'Target Closing Date', defaultVal: 'January 15, 2027', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Delaware', type: 'text' }
    ],
    templateBody: `COMMERCIAL ASSET PURCHASE AGREEMENT

THIS ASSET PURCHASE AGREEMENT is made effective as of {{EFFECTIVE_DATE}}, by and between {{SELLER_ENTITY}}, a Delaware limited liability company ("Seller"), and {{BUYER_ENTITY}}, a Delaware corporation ("Buyer").

ARTICLE I — PURCHASE AND SALE OF ASSETS
1.1 Acquired Assets. Subject to the terms and conditions hereof, Seller agrees to sell, assign, and convey to Buyer, and Buyer agrees to purchase from Seller, all right, title, and interest in and to all assets, properties, software, customer contracts, intellectual property, and equipment of Seller set forth on Schedule 1.1 (collectively, the "Acquired Assets").
1.2 Excluded Liabilities. Buyer shall not assume, nor shall Buyer be deemed to have assumed, any debts, obligations, tort claims, or tax liabilities of Seller, whether accrued, absolute, or contingent (the "Excluded Liabilities"). Seller shall retain, pay, and satisfy all Excluded Liabilities when due.

ARTICLE II — PURCHASE PRICE & ESCROW
2.1 Purchase Price. The aggregate purchase price for the Acquired Assets shall be {{PURCHASE_PRICE_WORDS}} ({{PURCHASE_PRICE_NUM}}). At Closing, Buyer shall deliver the Purchase Price less the Escrow Holdback by wire transfer to Seller.
2.2 Indemnity Escrow. At Closing, Buyer shall deposit {{ESCROW_HOLDBACK}} with the designated escrow agent to secure Seller's indemnification representations for a period of twelve (12) months following Closing.

ARTICLE III — CLOSING CONDITIONS
Buyer's obligation to consummate the transaction is subject to the delivery of all required disclosure schedules set forth in Exhibit C, absence of Material Adverse Effect, and delivery of non-competition agreements by Seller principals.

ARTICLE IV — GOVERNING LAW
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}.

SELLER: {{SELLER_ENTITY}}          BUYER: {{BUYER_ENTITY}}
By: ___________________________    By: ___________________________`
  },

  // 6. COMMERCIAL TRIPLE NET (NNN) LEASE
  {
    id: 'commercial_triple_net_lease',
    category: 'real_estate',
    title: 'Commercial Real Estate Lease Agreement (Triple Net / NNN)',
    titleAr: 'عقد إيجار تجاري مشروط بالضرائب والتأمين (Triple Net NNN Lease)',
    jurisdiction: 'Commercial Real Estate Standard Practice',
    summary: 'Standard commercial tenant lease where tenant pays base rent plus proportional share of property taxes, building insurance, and common area maintenance (CAM).',
    variables: [
      { key: 'LANDLORD_NAME', label: 'Landlord Legal Entity', defaultVal: 'Metro Commercial Properties LP', type: 'text' },
      { key: 'TENANT_NAME', label: 'Tenant Full Legal Name', defaultVal: 'BlueStar Logistics Group Inc.', type: 'text' },
      { key: 'PREMISES_ADDRESS', label: 'Leased Premises Address & Suite', defaultVal: '500 Enterprise Boulevard, Suite 300, Dallas, TX', type: 'text' },
      { key: 'RENTABLE_SQFT', label: 'Rentable Square Footage', defaultVal: '15,000 RSF', type: 'text' },
      { key: 'BASE_ANNUAL_RENT', label: 'Annual Base Rent ($)', defaultVal: '$360,000.00', type: 'text' },
      { key: 'MONTHLY_RENT', label: 'Initial Monthly Base Rent ($)', defaultVal: '$30,000.00', type: 'text' },
      { key: 'INITIAL_TERM_YEARS', label: 'Initial Lease Term (Years)', defaultVal: '5', type: 'text' },
      { key: 'SECURITY_DEPOSIT', label: 'Security Deposit ($)', defaultVal: '$60,000.00', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'Texas', type: 'text' }
    ],
    templateBody: `COMMERCIAL REAL ESTATE LEASE AGREEMENT (TRIPLE NET / NNN)

This Commercial Lease Agreement (this "Lease") is entered into on {{EFFECTIVE_DATE}}, by and between {{LANDLORD_NAME}} ("Landlord") and {{TENANT_NAME}} ("Tenant").

1. PREMISES
Landlord leases to Tenant, and Tenant leases from Landlord, the commercial premises situated at {{PREMISES_ADDRESS}}, consisting of approximately {{RENTABLE_SQFT}} (the "Premises").

2. TERM
The initial term shall be {{INITIAL_TERM_YEARS}} years, commencing on the Commencement Date and expiring on the final day of the calendar month {{INITIAL_TERM_YEARS}} years thereafter.

3. RENT & TRIPLE NET OBLIGATIONS
(a) Base Rent. Tenant shall pay Landlord annual base rent of {{BASE_ANNUAL_RENT}}, payable in equal monthly installments of {{MONTHLY_RENT}} in advance on the first day of each calendar month.
(b) Additional Rent (Triple Net). In addition to Base Rent, Tenant shall pay its proportionate share of: (i) all real estate taxes and assessments levied against the building; (ii) all casualty and liability insurance premiums; and (iii) common area maintenance (CAM) operational expenses.

4. SECURITY DEPOSIT
Tenant shall deposit with Landlord the sum of {{SECURITY_DEPOSIT}} as security for the faithful performance of all covenants herein.

5. USE & MAINTENANCE
The Premises shall be used exclusively for general commercial, executive office, and warehousing operations in full compliance with municipal zoning codes. Tenant shall maintain the interior of the Premises in good working order.

6. GOVERNING LAW
This Lease shall be construed in accordance with the laws of the State of {{GOVERNING_STATE}}.

LANDLORD: {{LANDLORD_NAME}}        TENANT: {{TENANT_NAME}}
By: ___________________________    By: ___________________________`
  },

  // 7. SECURED COMMERCIAL PROMISSORY NOTE & LOAN AGREEMENT
  {
    id: 'commercial_promissory_note',
    category: 'finance',
    title: 'Secured Commercial Promissory Note & Loan Agreement',
    titleAr: 'سند إذني تجاري مضمون واتفاقية قرض (Promissory Note & Loan)',
    jurisdiction: 'Uniform Commercial Code (UCC Article 9) / New York Law',
    summary: 'Binding negotiable commercial promissory note with amortization mechanics, events of default acceleration, late fee penalties, and UCC Article 9 security collateral attachment.',
    variables: [
      { key: 'BORROWER_NAME', label: 'Borrower Legal Entity', defaultVal: 'Apex Prime Ventures LLC', type: 'text' },
      { key: 'LENDER_NAME', label: 'Lender Legal Entity', defaultVal: 'Hudson Valley Commercial Credit Fund LP', type: 'text' },
      { key: 'PRINCIPAL_SUM_WORDS', label: 'Principal Sum (Words)', defaultVal: 'One Million Five Hundred Thousand Dollars', type: 'text' },
      { key: 'PRINCIPAL_SUM_NUM', label: 'Principal Sum ($)', defaultVal: '$1,500,000', type: 'text' },
      { key: 'INTEREST_RATE_PCT', label: 'Annual Interest Rate (%)', defaultVal: '8.5%', type: 'text' },
      { key: 'MATURITY_DATE', label: 'Maturity Date', defaultVal: 'October 31, 2028', type: 'date' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'New York', type: 'text' }
    ],
    templateBody: `SECURED COMMERCIAL PROMISSORY NOTE

Principal Amount: {{PRINCIPAL_SUM_NUM}}                                    Date: {{EFFECTIVE_DATE}}

FOR VALUE RECEIVED, {{BORROWER_NAME}}, a Delaware limited liability company ("Borrower"), promises to pay to the order of {{LENDER_NAME}}, a Delaware limited partnership ("Lender"), the principal sum of {{PRINCIPAL_SUM_WORDS}} ({{PRINCIPAL_SUM_NUM}}), together with interest on the unpaid principal balance at the rate of {{INTEREST_RATE_PCT}} per annum.

1. REPAYMENT TERMS
Interest shall accrue on the basis of a 360-day year. Borrower shall make monthly consecutive interest-only payments on the first business day of each calendar month, with the entire outstanding principal balance, together with all accrued and unpaid interest, fully due and payable on {{MATURITY_DATE}} (the "Maturity Date").

2. SECURITY & COLLATERAL
This Note is secured by that certain Commercial Security Agreement of even date herewith granting Lender a first priority security interest in all equipment, accounts receivable, and general intangibles of Borrower pursuant to Article 9 of the Uniform Commercial Code.

3. EVENTS OF DEFAULT & ACCELERATION
Upon the occurrence of: (a) failure to pay any installment within five (5) days of its due date; (b) commencement of voluntary or involuntary bankruptcy proceedings; or (c) material breach of any loan covenant, Lender may declare the entire unpaid principal balance immediately due and payable without presentment, demand, or notice of any kind, all of which are expressly waived by Borrower.

4. ATTORNEYS' FEES & USURY SAVINGS
If this Note is placed in the hands of an attorney for collection upon default, Borrower shall pay all reasonable attorneys' fees and collection expenses. In no event shall interest charged exceed the maximum lawful rate permitted under applicable state usury laws.

5. GOVERNING LAW
This Note shall be governed by and construed in accordance with the laws of the State of {{GOVERNING_STATE}}.

BORROWER:
{{BORROWER_NAME}}
By: ___________________________ Name: [Managing Member] Title: Principal`
  },

  // 8. INDEPENDENT CONTRACTOR & WORK-FOR-HIRE AGREEMENT
  {
    id: 'independent_contractor_agreement',
    category: 'services',
    title: 'Independent Contractor & IP Work-For-Hire Agreement',
    titleAr: 'عقد مستشار مستقل ونقل حقوق الملكية الفكرية (1099 Agreement)',
    jurisdiction: 'U.S. Copyright Act 17 U.S.C. § 101 / IRS 20-Factor Test',
    summary: 'Essential contractor agreement ensuring zero employee co-employment risks while securing comprehensive assignment of copyrights, patents, software code, and trade secrets to the client.',
    variables: [
      { key: 'COMPANY_NAME', label: 'Company Legal Entity', defaultVal: 'Quantum AI Systems Inc.', type: 'text' },
      { key: 'CONTRACTOR_NAME', label: 'Contractor Full Name / Entity', defaultVal: 'Dr. Gregory Vance, Ph.D.', type: 'text' },
      { key: 'SERVICES_DESCRIPTION', label: 'Scope of Engineering/Legal Services', defaultVal: 'algorithmic optimization, patent portfolio analysis, and machine learning infrastructure review', type: 'text' },
      { key: 'COMPENSATION_RATE', label: 'Compensation Rate (Hourly / Milestone)', defaultVal: '$225.00 per hour, not to exceed $25,000 monthly without prior written approval', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultVal: 'California', type: 'text' }
    ],
    templateBody: `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}}, by and between {{COMPANY_NAME}} ("Company") and {{CONTRACTOR_NAME}} ("Contractor").

1. ENGAGEMENT & SCOPE OF SERVICES
Company hereby engages Contractor, and Contractor agrees to perform, the following specialized services: {{SERVICES_DESCRIPTION}} (the "Services"). Contractor shall retain sole control over the manner and means of performing the Services, subject only to the final commercial specifications of Company.

2. COMPENSATION
As full consideration for the Services, Company shall pay Contractor at the rate of {{COMPENSATION_RATE}}. Contractor shall submit monthly itemized invoices, payable within thirty (30) days of receipt.

3. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor and not an employee, agent, or partner of Company. Contractor shall not be entitled to worker's compensation, health insurance, retirement contributions, or unemployment benefits. Contractor bears sole responsibility for all federal, state, and local self-employment and income taxes.

4. PROPRIETARY RIGHTS & WORK FOR HIRE
All inventions, software code, documentation, reports, designs, and work product conceived, reduced to practice, or authored by Contractor in connection with the Services (the "Work Product") shall belong exclusively to Company. Contractor acknowledges that all copyrightable Work Product shall be deemed a "work made for hire" for Company under 17 U.S.C. § 101. To the extent any Work Product is not a work made for hire, Contractor hereby irrevocably assigns to Company all worldwide right, title, and interest in and to such Work Product.

5. GOVERNING LAW
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}.

COMPANY: {{COMPANY_NAME}}           CONTRACTOR: {{CONTRACTOR_NAME}}
By: ___________________________    By: ___________________________`
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
