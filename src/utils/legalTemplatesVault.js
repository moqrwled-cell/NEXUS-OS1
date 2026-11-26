/**
 * Nexus ContractGuard Enterprise — AmLaw 100 Legal Templates Vault
 * 100% Client-Side Deterministic Legal Drafting Engine (Air-Gapped).
 * Authentic United States institutional contracts featuring formal BigLaw structure,
 * RECITALS, hierarchical ARTICLE/Section numbering, Bluebook statutory citations (§),
 * and aligned dual-column execution blocks.
 */

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Practice Areas' },
  { id: 'real_estate', label: 'Real Estate & Leasing' },
  { id: 'corporate', label: 'Corporate & M&A' },
  { id: 'services', label: 'Commercial & IP' },
  { id: 'finance', label: 'Lending & Credit' },
  { id: 'dispute', label: 'Litigation & Settlements' }
];

export const LEGAL_TEMPLATES = [
  {
    id: 'commercial_land_psa',
    title: 'Commercial Land Purchase and Sale Agreement',
    category: 'real_estate',
    jurisdiction: '50-State U.S. Commercial Real Property',
    description: 'Institutional commercial real estate PSA featuring due diligence feasibility, ALTA survey requirements, title commitment review, as-is disclaimers, and subordinated earnest money remedies.',
    variables: [
      { key: 'SELLER_NAME', label: 'Seller Legal Name', defaultValue: 'Horizon Land Holdings LLC', type: 'text' },
      { key: 'BUYER_NAME', label: 'Buyer Legal Name', defaultValue: 'Vanguard Development Group Inc.', type: 'text' },
      { key: 'PROPERTY_ADDRESS', label: 'Property Street Address', defaultValue: '1400 Commerce Boulevard, Springfield, TX 78701', type: 'text' },
      { key: 'PARCEL_ID', label: 'Tax Parcel ID / APN', defaultValue: 'APN-0294-881-04', type: 'text' },
      { key: 'ACREAGE', label: 'Approximate Acreage', defaultValue: '12.5 acres', type: 'text' },
      { key: 'PURCHASE_PRICE_WORDS', label: 'Purchase Price (Words)', defaultValue: 'four million five hundred thousand dollars', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Purchase Price ($)', defaultValue: '$4,500,000', type: 'text' },
      { key: 'EARNEST_MONEY_NUM', label: 'Earnest Money Deposit ($)', defaultValue: '$150,000', type: 'text' },
      { key: 'TITLE_COMPANY', label: 'Escrow / Title Company', defaultValue: 'First American Title Insurance Company', type: 'text' },
      { key: 'INSPECTION_DAYS', label: 'Due Diligence Period (Days)', defaultValue: '45', type: 'text' },
      { key: 'CLOSING_DAYS', label: 'Closing Window (Days post-Feasibility)', defaultValue: '30', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of Texas', type: 'text' }
    ],
    templateBody: `This Commercial Land Purchase and Sale Agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{SELLER_NAME}} ("Seller") and {{BUYER_NAME}} ("Buyer", and together with Seller, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, Seller is the owner in fee simple of that certain tract or parcel of commercial real property commonly known as {{PROPERTY_ADDRESS}}, designated as Parcel ID {{PARCEL_ID}}, comprising approximately {{ACREAGE}}, together with all easements, hereditaments, development rights, and appurtenances thereto (collectively, the "Property"); and

WHEREAS, Seller desires to sell and convey the Property to Buyer, and Buyer desires to purchase and acquire the Property from Seller, strictly upon the terms, covenants, and conditions set forth in this Agreement.

NOW, THEREFORE, in consideration of the mutual covenants, representations, warranties, and agreements hereinafter set forth, and for other good and valuable consideration, the receipt and legal sufficiency of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. CONVEYANCE AND PURCHASE PRICE

1.1 Agreement to sell and purchase. Seller hereby agrees to sell and convey good and marketable fee simple title to the Property to Buyer, and Buyer agrees to purchase the Property from Seller, in strict accordance with this Agreement.

1.2 Purchase price. The aggregate purchase price for the Property shall be {{PURCHASE_PRICE_WORDS}} ({{PURCHASE_PRICE_NUM}}) (the "Purchase Price"), payable by wire transfer of immediately available federal funds at Closing, subject to customary closing adjustments and prorations herein specified.

1.3 Earnest money deposit. Within three (3) business days following the Effective Date, Buyer shall deposit {{EARNEST_MONEY_NUM}} (the "Earnest Money") with {{TITLE_COMPANY}} ("Escrow Agent"), to be held in an interest-bearing escrow account and applied to the Purchase Price at Closing or disbursed strictly pursuant to this Agreement.

ARTICLE II. TITLE, SURVEY, AND DUE DILIGENCE

2.1 Title commitment and ALTA survey. Within ten (10) business days after the Effective Date, Escrow Agent shall deliver to Buyer a current Title Commitment for an ALTA owner's policy of title insurance together with legible copies of all recorded exception documents. Buyer may obtain a current survey certified to ALTA/NSPS standards at Buyer's expense. Any title or survey objection not waived in writing prior to expiration of the Inspection Period shall entitle Buyer to terminate this Agreement or require Seller cure.

2.2 Feasibility and inspection period. Buyer shall have a period of {{INSPECTION_DAYS}} calendar days commencing on the Effective Date (the "Inspection Period") to conduct physical, Phase I and Phase II environmental, geotechnical, zoning, and economic feasibility studies. Buyer may terminate this Agreement for any reason or no reason prior to expiration of the Inspection Period by delivering written notice to Seller, whereupon the Earnest Money shall be refunded immediately to Buyer and neither Party shall have further obligation hereunder except for obligations that expressly survive termination.

ARTICLE III. REPRESENTATIONS, AS-IS DISCLAIMER, AND CLOSING

3.1 Seller representations. Seller represents and warrants to Buyer as of the Effective Date and as of Closing that: (a) Seller is duly organized, validly existing, and holds fee simple title to the Property; (b) Seller has full power and authority to execute and perform this Agreement without violating any third-party agreement or court order; and (c) to Seller's actual knowledge, there are no pending or threatened condemnation proceedings, material litigation, or unrecorded purchase options affecting the Property.

3.2 As-is condition. EXCEPT FOR SELLER'S EXPRESS REPRESENTATIONS AND WARRANTIES SET FORTH IN SECTION 3.1 AND IN THE SPECIAL WARRANTY DEED DELIVERED AT CLOSING, BUYER ACKNOWLEDGES THAT IT IS ACQUIRING THE PROPERTY STRICTLY ON AN "AS-IS, WHERE-IS" BASIS WITH ALL FAULTS, AND SELLER DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE TO THE MAXIMUM EXTENT PERMITTED UNDER {{GOVERNING_STATE}} LAW.

3.3 Closing and prorations. Closing shall occur on or before {{CLOSING_DAYS}} calendar days following expiration of the Inspection Period through Escrow Agent. At Closing, Seller shall execute and deliver a duly acknowledged Special Warranty Deed, a Non-Foreign Affidavit pursuant to FIRPTA, and customary owner title affidavits. Ad valorem real property taxes and assessments for the year of Closing shall be prorated on a per diem basis as of midnight preceding the Closing Date.

ARTICLE IV. REMEDIES AND GENERAL PROVISIONS

4.1 Default and liquidated damages. If Buyer defaults on its obligation to purchase the Property after expiration of the Inspection Period, Seller may terminate this Agreement and retain the Earnest Money as agreed liquidated damages and NOT as a penalty, WHICH SHALL BE SELLER'S SOLE AND EXCLUSIVE REMEDY FOR SUCH DEFAULT, EXCEPT WITH RESPECT TO BUYER'S EXPRESS INDEMNIFICATION AND SURVIVING OBLIGATIONS HEREUNDER. If Seller defaults, Buyer may either terminate this Agreement and recover the Earnest Money plus documented pursuit costs, or pursue specific performance.

4.2 Notices. All notices hereunder shall be in writing and deemed given when delivered personally, sent by nationally recognized overnight courier, or deposited in certified mail, return receipt requested, to the designated addresses of the Parties.

4.3 Entire Agreement; severability; counterparts. This Agreement constitutes the entire agreement between the Parties and supersedes all prior understandings. No amendment shall be effective unless executed in a signed writing by both Parties. If any provision is held invalid, the remaining provisions shall continue in full force. This Agreement may be executed in counterparts and by electronic signature in compliance with 15 U.S.C. § 7001.

4.4 Governing Law and venue. This Agreement shall be governed by and construed in accordance with the laws of {{GOVERNING_STATE}}, without regard to conflict-of-laws principles, and exclusive venue for any proceeding arising hereunder shall lie in the state or federal courts where the Property is situated.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

SELLER:                                BUYER:
{{SELLER_NAME}}                        {{BUYER_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: ___________________________     Title: ___________________________
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'residential_real_estate_contract',
    title: 'Residential Real Estate Purchase Contract',
    category: 'real_estate',
    jurisdiction: '50-State U.S. Residential Real Property',
    description: 'Comprehensive residential single-family purchase agreement incorporating financing contingencies, statutory home inspection rights, federal lead-based paint disclosures, and closing terms.',
    variables: [
      { key: 'SELLER_NAME', label: 'Seller Full Legal Name', defaultValue: 'Jonathan Mercer & Elena Mercer', type: 'text' },
      { key: 'BUYER_NAME', label: 'Buyer Full Legal Name', defaultValue: 'David R. Sterling', type: 'text' },
      { key: 'PROPERTY_ADDRESS', label: 'Residential Property Address', defaultValue: '742 Evergreen Terrace, Springfield, IL 60523', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Purchase Price ($)', defaultValue: '$685,000', type: 'text' },
      { key: 'EARNEST_MONEY_NUM', label: 'Earnest Money Deposit ($)', defaultValue: '$20,000', type: 'text' },
      { key: 'MORTGAGE_PCT', label: 'Mortgage Loan Percentage', defaultValue: '80%', type: 'text' },
      { key: 'CLOSING_DATE', label: 'Target Closing Date', defaultValue: 'August 30, 2026', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Property State', defaultValue: 'State of Illinois', type: 'text' }
    ],
    templateBody: `This Residential Real Estate Purchase Contract (this "Agreement") is entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{SELLER_NAME}} ("Seller") and {{BUYER_NAME}} ("Buyer", and together with Seller, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, Seller owns fee simple title to the single-family residential real property located at {{PROPERTY_ADDRESS}}, together with all permanent improvements, fixtures, built-in appliances, window treatments, and appurtenances thereto (collectively, the "Property"); and

WHEREAS, Seller desires to sell the Property to Buyer, and Buyer desires to purchase the Property from Seller, subject to the terms, contingencies, and disclosures set forth in this Agreement.

NOW, THEREFORE, in consideration of the mutual covenants and promises set forth herein, the sufficiency of which is hereby acknowledged, the Parties agree as follows:

ARTICLE I. PURCHASE PRICE AND EARNEST MONEY

1.1 Sale of property. Seller shall convey fee simple Marketable Title to the Property to Buyer by General Warranty Deed, free and clear of all monetary liens and encumbrances other than municipal utility easements and real estate taxes not yet due and payable.

1.2 Purchase price. The total purchase price for the Property is {{PURCHASE_PRICE_NUM}} (the "Purchase Price"), payable by certified funds or wire transfer at Closing.

1.3 Earnest money deposit. Within two (2) business days after the Effective Date, Buyer shall deposit {{EARNEST_MONEY_NUM}} (the "Earnest Money") in trust with a licensed title company or closing attorney acting as escrow agent ("Escrow Agent"), to be credited toward the Purchase Price at Closing.

ARTICLE II. CONTINGENCIES AND STATUTORY DISCLOSURES

2.1 Financing contingency. Buyer's obligation to close is contingent upon Buyer obtaining a written mortgage loan commitment for up to {{MORTGAGE_PCT}} of the Purchase Price at prevailing market interest rates within twenty-one (21) calendar days of the Effective Date. If Buyer applies in good faith and is unable to obtain such commitment despite diligent effort, Buyer may terminate this Agreement by written notice prior to expiration of the financing period and receive a full refund of the Earnest Money.

2.2 Physical inspection contingency. Buyer shall have ten (10) calendar days after the Effective Date (the "Inspection Period") to have licensed inspectors evaluate the structural, mechanical, electrical, plumbing, roof, and environmental condition of the Property. Prior to expiration of the Inspection Period, Buyer may accept the Property, request reasonable repairs or closing credits, or terminate this Agreement by written notice for a full refund of the Earnest Money.

2.3 Federal and state disclosures. Seller shall timely furnish all disclosures mandated by {{GOVERNING_STATE}} residential property disclosure statutes. For residential structures built prior to 1978, Seller shall execute and deliver the federal lead-based paint disclosure required under 42 U.S.C. § 4852d prior to Buyer becoming obligated hereunder.

ARTICLE III. CLOSING, RISK OF LOSS, AND POSSESSION

3.1 Closing Date and prorations. Closing shall occur on or before {{CLOSING_DATE}} (the "Closing Date"). Real estate taxes, homeowner association assessments, and municipal utility charges shall be prorated through the Closing Date. Physical possession and all keys, garage remotes, and security codes shall be delivered to Buyer upon deed recording and disbursement of funds.

3.2 Risk of loss. Until Closing, risk of fire or casualty loss remains with Seller. If material damage exceeding five percent (5%) of the Purchase Price occurs prior to Closing, Buyer may terminate this Agreement with full Earnest Money refund or close and receive an assignment of applicable insurance proceeds.

ARTICLE IV. REMEDIES AND GENERAL PROVISIONS

4.1 Default and remedies. If Buyer fails to perform its obligations after all contingencies are satisfied or waived, Seller may retain the Earnest Money as agreed liquidated damages and NOT as a penalty, WHICH SHALL CONSTITUTE SELLER'S SOLE REMEDY, EXCEPT WITH RESPECT TO BUYER'S EXPRESS INDEMNIFICATION OBLIGATIONS SURVIVING TERMINATION. If Seller defaults, Buyer may recover the Earnest Money or pursue specific performance.

4.2 Entire Agreement; counterparts; Governing Law. This Agreement constitutes the complete understanding of the Parties, supersedes all prior oral or written proposals, and may only be modified in a writing signed by each Party. This Agreement may be executed in counterparts via electronic signature and shall be governed by the laws of {{GOVERNING_STATE}}.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

SELLER:                                BUYER:
{{SELLER_NAME}}                        {{BUYER_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'commercial_real_estate_loi',
    title: 'Commercial Real Estate Letter of Intent (LOI)',
    category: 'real_estate',
    jurisdiction: 'State of Delaware / Multi-State',
    description: 'Institutional non-binding commercial real estate acquisition Letter of Intent with binding exclusivity (no-shop), strict confidentiality, earnest money structure, and statutory disclaimers.',
    variables: [
      { key: 'SELLER_NAME', label: 'Property Owner / Seller', defaultValue: 'Midtown Industrial Properties LP', type: 'text' },
      { key: 'BUYER_NAME', label: 'Prospective Purchaser', defaultValue: 'Blackstone Logistics Acquisition Corp.', type: 'text' },
      { key: 'PROPERTY_ADDRESS', label: 'Target Property Location', defaultValue: '8800 Industrial Parkway, Newark, NJ 07105', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Proposed Purchase Price ($)', defaultValue: '$12,250,000', type: 'text' },
      { key: 'EARNEST_MONEY_NUM', label: 'Initial Deposit ($)', defaultValue: '$250,000', type: 'text' },
      { key: 'DILIGENCE_DAYS', label: 'Due Diligence Window (Days)', defaultValue: '30', type: 'text' },
      { key: 'EXCLUSIVITY_DAYS', label: 'Exclusivity / No-Shop Period (Days)', defaultValue: '45', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of New Jersey', type: 'text' }
    ],
    templateBody: `VIA ELECTRONIC TRANSMISSION
Date: {{EFFECTIVE_DATE}}

TO:     {{SELLER_NAME}} ("Seller")
FROM:   {{BUYER_NAME}} ("Purchaser")
RE:     Non-Binding Letter of Intent -- Proposed Acquisition of {{PROPERTY_ADDRESS}}

Dear Seller:

{{BUYER_NAME}} ("Purchaser") is pleased to submit this non-binding Letter of Intent (this "Letter") setting forth the principal business terms upon which Purchaser is prepared to acquire from {{SELLER_NAME}} ("Seller", and together with Purchaser, each a "Party" and collectively the "Parties") the commercial real estate project identified below.

1.1 Target property. Purchaser proposes to acquire fee simple title to the land, buildings, site improvements, and appurtenant rights located at {{PROPERTY_ADDRESS}}, together with all assignable leases, service contracts, permits, and intangible property relating thereto (collectively, the "Property").

1.2 Proposed purchase price. Based upon Purchaser's preliminary underwriting, the proposed aggregate purchase price for the Property is {{PURCHASE_PRICE_NUM}} (the "Purchase Price"), payable in cash by wire transfer at Closing.

1.3 Earnest money deposit. Within three (3) business days after full execution of a definitive purchase and sale agreement (the "Definitive Agreement"), Purchaser shall deposit {{EARNEST_MONEY_NUM}} with a mutually acceptable national title insurer as earnest money, refundable during the Due Diligence Period and thereafter applied to the Purchase Price at Closing.

1.4 Due diligence and access. Purchaser shall have {{DILIGENCE_DAYS}} calendar days from execution of the Definitive Agreement (the "Due Diligence Period") to inspect the physical condition, environmental reports, existing tenant leases, rent rolls, Title Commitment, and ALTA survey of the Property.

1.5 Closing conditions. Closing shall occur thirty (30) calendar days following expiration of the Due Diligence Period, subject to delivery of Marketable Title by Special Warranty Deed, tenant estoppel certificates, and satisfaction of customary institutional closing conditions.

1.6 Binding confidentiality. Except as required by applicable law, neither Party shall disclose the existence, terms, or status of this Letter or the proposed transaction to any third party other than its attorneys, accountants, lenders, and institutional advisors bound by confidentiality duties.

1.7 Binding exclusivity. In consideration of the substantial resources Purchaser will commit to underwriting this transaction, for a period of {{EXCLUSIVITY_DAYS}} calendar days from mutual countersignature hereof, Seller and its affiliates and brokers shall not solicit, negotiate, or enter into any agreement with any third party concerning the sale, refinancing, or ground lease of the Property.

1.8 Non-binding nature and Governing Law. Except for Sections 1.6, 1.7, and this Section 1.8 (collectively, the "Binding Provisions"), which constitute valid and legally binding obligations upon execution, this Letter represents an expression of intent only and creates no enforceable obligation unless and until a Definitive Agreement is executed and delivered by both Parties. This Letter and the Binding Provisions shall be governed by the laws of {{GOVERNING_STATE}}.

Please indicate Seller's concurrence by countersigning and returning a copy of this Letter within five (5) business days hereof.

Sincerely,

PURCHASER:
{{BUYER_NAME}}

By: ______________________________
Name: ____________________________
Title: Authorized Signatory
Date: ____________________________

ACKNOWLEDGED AND AGREED SOLELY AS TO THE BINDING PROVISIONS (SECTIONS 1.6, 1.7, AND 1.8):

SELLER:
{{SELLER_NAME}}

By: ______________________________
Name: ____________________________
Title: Authorized Signatory
Date: ____________________________`
  },
  {
    id: 'commercial_triple_net_lease',
    title: 'Commercial Triple Net (NNN) Lease Agreement',
    category: 'real_estate',
    jurisdiction: '50-State U.S. Commercial Leasing',
    description: 'Institutional commercial Triple Net (NNN) lease shifting property taxes, casualty insurance, and CAM maintenance expenses to Tenant with strict indemnification and default remedies.',
    variables: [
      { key: 'LANDLORD_NAME', label: 'Landlord Legal Name', defaultValue: 'Apex Retail Realty Trust LLC', type: 'text' },
      { key: 'TENANT_NAME', label: 'Tenant Legal Name', defaultValue: 'Metro Health & Diagnostics Corp.', type: 'text' },
      { key: 'PREMISES_ADDRESS', label: 'Leased Premises Address', defaultValue: '3500 Market Plaza, Suite 100, Springfield, CO 80202', type: 'text' },
      { key: 'LEASE_TERM_YEARS', label: 'Initial Term (Years)', defaultValue: '5', type: 'text' },
      { key: 'MONTHLY_RENT_NUM', label: 'Initial Monthly Base Rent ($)', defaultValue: '$18,500', type: 'text' },
      { key: 'SECURITY_DEPOSIT_NUM', label: 'Security Deposit ($)', defaultValue: '$37,000', type: 'text' },
      { key: 'ESCALATION_PCT', label: 'Annual Rent Escalation (%)', defaultValue: '3.0%', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of Colorado', type: 'text' }
    ],
    templateBody: `This commercial Triple Net Lease Agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{LANDLORD_NAME}} ("Landlord") and {{TENANT_NAME}} ("Tenant", and together with Landlord, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, Landlord is the fee owner of the commercial building and real property located at {{PREMISES_ADDRESS}} (the "Premises"); and

WHEREAS, Landlord desires to lease the Premises to Tenant, and Tenant desires to lease the Premises from Landlord, on a strictly Triple Net basis pursuant to the terms, covenants, and conditions hereinafter set forth.

NOW, THEREFORE, in consideration of the mutual covenants, rents, and agreements herein contained, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. PREMISES, TERM, AND USE

1.1 Grant of premises. Landlord hereby leases the Premises to Tenant, and Tenant hires the Premises from Landlord, for a primary term of {{LEASE_TERM_YEARS}} consecutive years commencing on the Effective Date (the "Term"), unless sooner terminated as expressly provided herein.

1.2 Permitted use. Tenant shall use the Premises solely for lawful general commercial, professional, or retail operations in compliance with applicable zoning ordinances, building codes, and recorded covenants, and shall not cause any environmental contamination or hazardous waste release on the Premises.

ARTICLE II. BASE RENT, TRIPLE NET EXPENSES, AND SECURITY DEPOSIT

2.1 Base rent and annual escalation. Tenant shall pay to Landlord, without prior notice, demand, deduction, or setoff, monthly minimum rent of {{MONTHLY_RENT_NUM}} ("Base Rent") in advance on the first day of each calendar month. Base Rent shall automatically increase by {{ESCALATION_PCT}} on each anniversary of the Effective Date throughout the Term.

2.2 Triple Net operating charges. It is the intention of the Parties that this Agreement be an absolute Triple Net lease and that Base Rent be wholly net to Landlord. Tenant shall pay directly or reimburse Landlord as additional rent ("Additional Rent") for one hundred percent (100%) of Tenant's proportionate share of: (a) all real property taxes and special assessments; (b) property, casualty, and commercial general liability insurance premiums maintained for the Premises; and (c) Common Area Maintenance, HVAC servicing, utilities, landscaping, and non-structural repairs.

2.3 Security deposit. Upon execution hereof, Tenant shall deposit {{SECURITY_DEPOSIT_NUM}} with Landlord as security for the faithful performance of Tenant's obligations. Landlord may apply all or part of such deposit to cure any uncured Tenant default, and Tenant shall restore any applied balance within five (5) business days after written notice.

ARTICLE III. MAINTENANCE, INSURANCE, AND INDEMNIFICATION

3.1 Maintenance and repairs. Tenant shall maintain the interior, HVAC systems, storefronts, plumbing, electrical systems, and non-structural elements of the Premises in first-class condition at Tenant's sole cost. Landlord shall remain responsible solely for structural integrity of exterior foundation walls and primary roof framing, except where damaged by Tenant's negligence or willful acts.

3.2 Indemnification. Tenant shall indemnify, defend, and hold harmless Landlord and its officers, members, and agents from and against all claims, liabilities, losses, fines, and reasonable attorneys' fees arising out of Tenant's occupancy of the Premises or breach of this Agreement, EXCEPT TO THE EXTENT CAUSED BY THE GROSS NEGLIGENCE OR WILLFUL MISCONDUCT OF LANDLORD.

ARTICLE IV. DEFAULT, REMEDIES, AND SURRENDER

4.1 Events of Default. An "Event of Default" occurs if Tenant fails to pay Base Rent or Additional Rent within five (5) business days after written notice of nonpayment, or fails to cure any non-monetary breach within thirty (30) days after written notice thereof.

4.2 Remedies. Upon an Event of Default, Landlord may exercise all rights at law or in equity under {{GOVERNING_STATE}} law, including terminating this Agreement, re-entering the Premises, accelerating unpaid rents discounted to present value, and recovering reasonable attorneys' fees and costs.

4.3 Surrender and holdover. Upon expiration or earlier termination, Tenant shall surrender the Premises broom-clean and in good order, reasonable wear and tear excepted. Any holdover without prior written consent of either Party shall create a month-to-month tenancy at one hundred fifty percent (150%) of the immediately preceding monthly Base Rent.

ARTICLE V. GENERAL PROVISIONS

5.1 Subordination and estoppel. This Agreement is subordinate to existing and future institutional mortgages recorded against the Premises, provided the lender executes a commercially reasonable non-disturbance agreement recognizing Tenant's rights so long as Tenant is not in default.

5.2 Notices; Entire Agreement; Governing Law. All notices shall be in writing and sent via certified mail or nationally recognized overnight courier. This Agreement constitutes the entire agreement between the Parties, may be amended only by a signed writing, may be executed in counterparts via electronic signature, and shall be governed by the laws of {{GOVERNING_STATE}}.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

LANDLORD:                              TENANT:
{{LANDLORD_NAME}}                      {{TENANT_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: ___________________________     Title: ___________________________
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'commercial_asset_purchase_agreement',
    title: 'Asset Purchase Agreement (M&A)',
    category: 'corporate',
    jurisdiction: 'State of Delaware Corporate Law',
    description: 'Delaware M&A Asset Purchase Agreement featuring carve-out Excluded Liabilities, IRC Section 1060 purchase price allocation, capped indemnification with fraud carve-outs, and non-compete covenants.',
    variables: [
      { key: 'SELLER_NAME', label: 'Seller Entity Name', defaultValue: 'TechFlow Systems LLC', type: 'text' },
      { key: 'BUYER_NAME', label: 'Acquiring Entity Name', defaultValue: 'Vanguard Enterprise Solutions Inc.', type: 'text' },
      { key: 'PURCHASE_PRICE_NUM', label: 'Purchase Price ($)', defaultValue: '$2,400,000', type: 'text' },
      { key: 'ESCROW_HOLD_NUM', label: 'Indemnity Escrow Holdback ($)', defaultValue: '$240,000', type: 'text' },
      { key: 'NONCOMPETE_YEARS', label: 'Non-Compete Term (Years)', defaultValue: '3', type: 'text' }
    ],
    templateBody: `This Asset Purchase Agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{SELLER_NAME}} ("Seller") and {{BUYER_NAME}} ("Buyer", and together with Seller, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, Seller owns and operates an enterprise commercial technology business and owns certain operating assets, Intellectual Property, customer contracts, and goodwill used therein (the "Business"); and

WHEREAS, Seller desires to sell, transfer, and assign to Buyer, and Buyer desires to purchase and acquire from Seller, substantially all of the operating assets of the Business, strictly free and clear of Excluded Liabilities, upon the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual representations, warranties, covenants, and agreements contained herein, and for other good and valuable consideration, the receipt and adequacy of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. PURCHASE AND SALE OF ASSETS

1.1 Purchased assets. At Closing, Seller shall sell, transfer, assign, and deliver to Buyer, free and clear of all liens and encumbrances, all right, title, and interest in and to Seller's operating software, Intellectual Property, domain registrations, assigned customer agreements, business records, and goodwill (collectively, the "Purchased Assets").

1.2 Excluded Liabilities. BUYER ASSUMES NO LIABILITIES OF SELLER WHATSOEVER OTHER THAN EXPRESSLY ASSUMED PROSPECTIVE CONTRACT OBLIGATIONS ARISING AFTER CLOSING. Seller retains sole liability for all pre-Closing taxes, employee wages, litigation, indebtedness, and third-party claims (collectively, the "Excluded Liabilities").

ARTICLE II. PURCHASE CONSIDERATION AND TAX ALLOCATION

2.1 Purchase Price and escrow holdback. The aggregate purchase price for the Purchased Assets is {{PURCHASE_PRICE_NUM}} (the "Purchase Price"). At Closing, Buyer shall wire the Purchase Price less {{ESCROW_HOLD_NUM}}, which holdback amount shall be deposited into an independent twelve-month Escrow Account pursuant to a customary escrow agreement.

2.2 Tax allocation. The Parties agree to allocate the Purchase Price among the Purchased Assets in accordance with 26 U.S.C. § 1060 of the Internal Revenue Code of 1986, as amended, and each Party shall report such allocation consistently on IRS Form 8594.

ARTICLE III. REPRESENTATIONS, WARRANTIES, AND INDEMNIFICATION

3.1 Seller representations. Seller represents and warrants that: (a) Seller is duly organized and validly existing under applicable law with full authority to consummate this transaction; (b) Seller holds sole marketable title to the Purchased Assets without infringement upon third-party Intellectual Property rights; and (c) there are no undisclosed proceedings, tax liens, or regulatory enforcement actions pending or threatened against the Business.

3.2 Indemnification and carve-outs. Seller shall indemnify, defend, and hold harmless Buyer from and against all losses arising from any breach of Seller's representations or any Excluded Liabilities. Except with respect to fraud, intentional misrepresentation, willful misconduct, or Excluded Liabilities, Seller's aggregate indemnification liability under this Agreement shall not exceed the Purchase Price, and all reasonable attorneys' fees incurred in defending covered third-party claims shall constitute recoverable direct damages.

ARTICLE IV. RESTRICTIVE COVENANTS AND GENERAL PROVISIONS

4.1 Non-competition and non-solicitation. For a period of {{NONCOMPETE_YEARS}} years following Closing, Seller and its controlling principals shall not directly or indirectly engage in any business competitive with the Business within the United States or solicit any assigned customer or transferred employee of the Business.

4.2 Entire Agreement and severability. This Agreement, together with all schedules and ancillary closing documents, constitutes the entire understanding of the Parties, supersedes all prior letters of intent, and may be amended only by a signed writing. Any unenforceable restriction shall be judicially modified to the maximum enforceable scope permitted by law.

4.3 Counterparts and Governing Law. This Agreement may be executed in counterparts via electronic transmission and shall be governed by the laws of the State of Delaware, without giving effect to conflict-of-laws rules. Each Party irrevocably submits to the exclusive jurisdiction of the Delaware Court of Chancery or the United States District Court located in Delaware, and waives trial by jury to the fullest extent permitted by law.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

SELLER:                                BUYER:
{{SELLER_NAME}}                        {{BUYER_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: ___________________________     Title: ___________________________
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'llc_operating_agreement',
    title: 'Delaware Limited Liability Company Operating Agreement',
    category: 'corporate',
    jurisdiction: 'State of Delaware (6 Del. C. § 18-101)',
    description: 'Institutional Delaware multi-member LLC Operating Agreement with IRC Section 704(b) capital accounts, Bipartisan Budget Act tax audit compliance, management governance, and transfer/ROFR restrictions.',
    variables: [
      { key: 'LLC_NAME', label: 'Delaware LLC Legal Name', defaultValue: 'Meridian Ventures Holdings LLC', type: 'text' },
      { key: 'MEMBER_1_NAME', label: 'Managing Member 1', defaultValue: 'Arthur Pendelton', type: 'text' },
      { key: 'MEMBER_1_PCT', label: 'Member 1 Ownership (%)', defaultValue: '60%', type: 'text' },
      { key: 'MEMBER_1_CAPITAL', label: 'Member 1 Capital Contribution ($)', defaultValue: '$150,000', type: 'text' },
      { key: 'MEMBER_2_NAME', label: 'Member 2 Legal Name', defaultValue: 'Claire Sterling', type: 'text' },
      { key: 'MEMBER_2_PCT', label: 'Member 2 Ownership (%)', defaultValue: '40%', type: 'text' },
      { key: 'MEMBER_2_CAPITAL', label: 'Member 2 Capital Contribution ($)', defaultValue: '$100,000', type: 'text' },
      { key: 'BUSINESS_PURPOSE', label: 'Company Business Purpose', defaultValue: 'software technology commercialization and strategic venture investments', type: 'text' }
    ],
    templateBody: `This limited liability company operating agreement of {{LLC_NAME}} (this "Agreement") is entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and among {{MEMBER_1_NAME}} and {{MEMBER_2_NAME}} (each a "Member" and collectively the "Members").

RECITALS

WHEREAS, {{LLC_NAME}} (the "Company") was formed as a limited liability company pursuant to the Delaware limited liability company statute, 6 Del. C. § 18-101 et seq., as amended from time to time (the "DLLCA"), by the filing of a certificate of formation with the Secretary of State of the State of Delaware; and

WHEREAS, the Members desire to enter into this Agreement to establish the governance, capital structure, tax allocations, distributions, and relative rights and obligations of the Members with respect to the Company.

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein set forth, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Members agree as follows:

ARTICLE I. ORGANIZATION AND PURPOSE

1.1 Formation and name. The business and affairs of the Company shall be conducted under the name "{{LLC_NAME}}" pursuant to the DLLCA and this Agreement. The registered office and registered agent in the State of Delaware shall be as stated in the Company certificate of formation or as subsequently designated by the Members.

1.2 Business purpose. The purpose of the Company is to engage in {{BUSINESS_PURPOSE}} and any other lawful business, purpose, or activity permitted for limited liability companies under the DLLCA.

1.3 Term. The term of the Company commenced upon filing of the certificate of formation and shall continue in perpetuity unless earlier dissolved in accordance with Article IV or the DLLCA.

ARTICLE II. MEMBERS, CAPITAL CONTRIBUTIONS, AND LIABILITY

2.1 Initial capital and ownership interests. Upon execution of this Agreement, the Members shall hold the following percentage interests (each, a "Percentage Interest") and make the following initial capital contributions: (a) {{MEMBER_1_NAME}}: {{MEMBER_1_PCT}} Percentage Interest, contributing {{MEMBER_1_CAPITAL}}; and (b) {{MEMBER_2_NAME}}: {{MEMBER_2_PCT}} Percentage Interest, contributing {{MEMBER_2_CAPITAL}}.

2.2 Capital Accounts and additional capital. An individual Capital Account shall be maintained for each Member in strict accordance with treasury regulations 26 C.F.R. § 1.704-1(b)(2)(iv). No Member shall be obligated to make any additional capital contribution without the unanimous written consent of all Members.

2.3 Limitation of Member liability. Except as expressly required by non-waivable provisions of the DLLCA, no Member shall be personally liable for any debt, obligation, judgment, or liability of the Company solely by reason of being a Member of the Company.

ARTICLE III. ALLOCATIONS, DISTRIBUTIONS, AND TAX MATTERS

3.1 Tax classification and allocations. The Members intend that the Company be classified as a partnership for United States federal, state, and local income tax purposes. Profits, losses, and tax items for each fiscal year shall be allocated among the Members strictly in proportion to the Percentage Interest held by each Member.

3.2 Cash distributions. Available net cash flow, after establishment of prudent operating reserves, shall be distributed at such times as determined by the Managing Member in proportion to the Percentage Interest held by each Member.

3.3 Partnership representative. {{MEMBER_1_NAME}} is hereby designated as the Company's partnership representative within the meaning of 26 U.S.C. § 6223 of the Internal Revenue Code, and shall keep all Members informed of any material tax audit or administrative proceeding.

ARTICLE IV. MANAGEMENT, TRANSFERS, AND DISSOLUTION

4.1 Management authority. Management of the business and affairs of the Company shall be vested in {{MEMBER_1_NAME}} (the "Managing Member"); provided, however, that unanimous written approval of all Members shall be required to: (a) amend this Agreement or the certificate of formation; (b) admit any new Member or issue additional Membership Interests; (c) sell, lease, or encumber substantially all assets of the Company; (d) incur indebtedness exceeding $50,000; or (e) merge, convert, or dissolve the Company.

4.2 Transfer restrictions and Right of First Refusal. No Member may sell, assign, pledge, or transfer any Membership Interest to any third party without first offering such interest in writing to the other Members on identical bona fide economic terms for a thirty (30) day election window. Any purported transfer in violation of this Section 4.2 shall be null and void ab initio.

4.3 Dissolution. The Company shall be dissolved only upon unanimous written consent of the Members, the sale of substantially all Company assets, or the entry of a decree of judicial dissolution under 6 Del. C. § 18-802 of the DLLCA.

ARTICLE V. GENERAL PROVISIONS

5.1 Books and records. Accurate books of account and records shall be maintained at the principal office of the Company and made available for inspection by any Member upon reasonable advance written notice during regular business hours.

5.2 Notices and Entire Agreement. All notices shall be in writing via nationally recognized overnight courier or certified mail. This Agreement constitutes the entire agreement among the Members and may only be amended by an instrument in writing signed by all Members.

5.3 Governing Law and counterparts. This Agreement shall be governed by and construed under the internal laws of the State of Delaware, without regard to conflict-of-laws rules, and may be executed in counterparts via electronic signature.

IN WITNESS WHEREOF, the Members have executed this Agreement as of the Effective Date first written above.

MEMBER 1:                              MEMBER 2:
{{MEMBER_1_NAME}}                      {{MEMBER_2_NAME}}

By: ______________________________     By: ______________________________
Name: {{MEMBER_1_NAME}}                Name: {{MEMBER_2_NAME}}
Title: Managing Member ({{MEMBER_1_PCT}}) Title: Member ({{MEMBER_2_PCT}})
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'master_services_agreement',
    title: 'Master Commercial Services Agreement (MSA)',
    category: 'services',
    jurisdiction: 'State of New York Commercial Law',
    description: 'Enterprise B2B technology and consulting Master Services Agreement featuring Statements of Work, work-for-hire IP ownership, mutual indemnification, and balanced limitation-of-liability carve-outs.',
    variables: [
      { key: 'CLIENT_NAME', label: 'Client Corporate Name', defaultValue: 'Citadel Financial Group Inc.', type: 'text' },
      { key: 'PROVIDER_NAME', label: 'Service Provider Entity', defaultValue: 'Nexus Cloud Engineering Corp.', type: 'text' },
      { key: 'PAYMENT_DAYS', label: 'Invoice Net Terms (Days)', defaultValue: '30', type: 'text' },
      { key: 'LIABILITY_CAP_MONTHS', label: 'Liability Cap Lookback (Months)', defaultValue: '12', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of New York', type: 'text' }
    ],
    templateBody: `This Master Commercial Services Agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{CLIENT_NAME}} ("Client") and {{PROVIDER_NAME}} ("Provider", and together with Client, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, Provider possesses specialized technical, engineering, and advisory capabilities; and

WHEREAS, Client desires to engage Provider from time to time to perform professional services and deliver custom work product pursuant to mutually executed written statements of work governed by the unified master terms of this Agreement.

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the receipt and legal sufficiency of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. SERVICES AND STATEMENTS OF WORK

1.1 Engagement and Statements of Work. Provider shall perform the professional services and deliver the deliverables specified in one or more written statements of work ("SOW") executed by authorized representatives of both Parties. Each SOW incorporates the terms of this Agreement by reference. In the event of conflict, this Agreement shall govern unless the applicable SOW expressly specifies an intent to supersede a stated section hereof.

1.2 Standard of Care. Provider represents and warrants that all services shall be performed in a diligent, professional, and workmanlike manner consistent with prevailing institutional industry standards by qualified personnel.

ARTICLE II. FEES, INVOICING, AND TAXES

2.1 Fees and payment terms. Client shall pay Provider the fees specified in each SOW. Undisputed invoices shall be due and payable net {{PAYMENT_DAYS}} calendar days from Client's receipt of an accurate, itemized invoice. Client may withhold payment on any portion disputed in good faith upon prompt written notice detailing the basis of dispute.

2.2 Taxes. Fees are exclusive of applicable sales, use, or excise taxes imposed by governmental authorities on services rendered, which shall be itemized separately on invoices, excluding taxes measured by Provider's net income or payroll.

ARTICLE III. INTELLECTUAL PROPERTY AND CONFIDENTIALITY

3.1 Work Product ownership. Upon full payment of applicable SOW fees, all custom deliverables, source code, documentation, and inventions created specifically for Client under an SOW ("Work Product") shall be owned exclusively by Client as a "work made for hire" under 17 U.S.C. § 101, and Provider hereby irrevocably assigns all worldwide Intellectual Property rights in such Work Product to Client.

3.2 Pre-Existing IP. Provider retains sole ownership of its pre-existing tools, frameworks, and methodologies ("Pre-Existing IP"). To the extent Pre-Existing IP is incorporated into any Work Product, Provider grants Client a perpetual, worldwide, paid-up, non-exclusive license to use such Pre-Existing IP in connection with Client's business operations.

3.3 Confidentiality. Each Party shall hold all non-public business, financial, and technical information received from the other Party in strict confidence using no less than a reasonable Standard of Care, and shall use such information solely to perform its obligations under this Agreement for five (5) years following termination, and indefinitely with respect to trade secrets.

ARTICLE IV. INDEMNIFICATION AND LIMITATION OF LIABILITY

4.1 Mutual Indemnification. Provider shall indemnify, defend, and hold harmless Client from any third-party claim alleging that the Work Product infringes any United States copyright, patent, or trade secret, or arising from Provider's gross negligence, willful misconduct, or bodily injury. Client shall indemnify, defend, and hold harmless Provider from third-party claims arising from Client's gross negligence, willful misconduct, or unauthorized modification of deliverables.

4.2 Limitation of Liability and carve-outs. EXCEPT FOR INDEMNIFICATION OBLIGATIONS UNDER SECTION 4.1, BREACHES OF CONFIDENTIALITY UNDER SECTION 3.3, INTELLECTUAL PROPERTY INFRINGEMENT, GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR FRAUD (EACH OF WHICH SHALL REMAIN UNCAPPED AND EXEMPT FROM CONSEQUENTIAL EXCLUSIONS), NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, AND EACH PARTY'S AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CLIENT UNDER THE APPLICABLE SOW DURING THE {{LIABILITY_CAP_MONTHS}} MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY. Defense fees and settlement amounts owed under Section 4.1 shall be deemed direct damages.

ARTICLE V. TERM, TERMINATION, AND GENERAL PROVISIONS

5.1 Term and termination. This Agreement shall remain effective until terminated. Either Party may terminate this Agreement or any SOW for uncured material breach upon thirty (30) calendar days' prior written notice. Client may terminate any SOW for convenience upon thirty (30) days' written notice upon payment for accepted services performed through the effective termination date.

5.2 Independent contractor status. Provider acts strictly as an independent contractor and not as an employee, partner, or agent of Client, and assumes sole responsibility for all payroll taxes, benefits, and workers' compensation insurance for its personnel.

5.3 Notices; Entire Agreement; Counterparts. Notices shall be in writing via nationally recognized overnight courier or certified mail. This Agreement and executed SOWs constitute the entire agreement between the Parties, may be amended only by signed writing, and may be executed in counterparts via electronic signature.

5.4 Governing Law and jury waiver. This Agreement shall be governed by the laws of {{GOVERNING_STATE}}, without reference to conflict-of-laws rules. Each Party irrevocably waives any right to a trial by jury in any legal proceeding arising out of this Agreement.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

CLIENT:                                SERVICE PROVIDER:
{{CLIENT_NAME}}                        {{PROVIDER_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: ___________________________     Title: ___________________________
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'mutual_nda_trade_secrets',
    title: 'Mutual Non-Disclosure & Trade Secrets Agreement',
    category: 'services',
    jurisdiction: 'State of Delaware / Federal DTSA (18 U.S.C. § 1833)',
    description: 'Bilateral commercial NDA incorporating uniform trade secret protections, compelled-disclosure notice safeguards, equitable relief rights, and statutory Defend Trade Secrets Act (DTSA) immunity notices.',
    variables: [
      { key: 'PARTY_A_NAME', label: 'First Disclosing/Receiving Party', defaultValue: 'Quantum Biopharma Labs Inc.', type: 'text' },
      { key: 'PARTY_B_NAME', label: 'Second Disclosing/Receiving Party', defaultValue: 'Pacific Venture Partners LLC', type: 'text' },
      { key: 'PURPOSE', label: 'Evaluated Business Purpose', defaultValue: 'evaluating a potential strategic licensing and investment transaction', type: 'text' },
      { key: 'CONFIDENTIALITY_YEARS', label: 'Confidentiality Term (Years)', defaultValue: '5', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of Delaware', type: 'text' }
    ],
    templateBody: `This mutual non-disclosure and trade secrets agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{PARTY_A_NAME}} and {{PARTY_B_NAME}} (each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, the Parties wish to exchange certain confidential, proprietary, and trade secret information solely for the purpose of {{PURPOSE}} (the "Purpose"); and

WHEREAS, each Party desires to protect the confidentiality and proprietary value of its disclosed information upon reciprocal terms.

NOW, THEREFORE, in consideration of the mutual promises and disclosures contemplated herein, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. DEFINITION AND EXCLUSIONS

1.1 Definition of Confidential Information. "Confidential Information" means all non-public business, financial, technical, clinical, customer, source-code, product roadmap, and valuation information disclosed by or on behalf of a Party (the "Disclosing Party") to the other Party (the "Receiving Party"), whether in written, electronic, visual, or oral form, that is marked confidential or reasonably understood to be confidential given its nature and circumstances of disclosure.

1.2 Standard exclusions. Confidential Information shall not include information that the Receiving Party proves through contemporaneous written records: (a) is or becomes generally available to the public through no wrongful act of the Receiving Party; (b) was rightfully in the Receiving Party's possession free of confidentiality restrictions prior to disclosure; (c) is lawfully obtained from an independent third party without breach of confidence; or (d) is independently developed without use of or reference to Confidential Information of the Disclosing Party.

ARTICLE II. OBLIGATIONS OF CONFIDENTIALITY AND DTSA NOTICE

2.1 Non-disclosure and Standard of Care. The Receiving Party shall hold all Confidential Information in strict confidence using at least the same degree of care it uses to protect its own confidential assets (and in no event less than a reasonable Standard of Care), shall not use any Confidential Information except for the Purpose, and shall limit access solely to personnel and professional advisors bound by written confidentiality obligations at least as protective as this Agreement.

2.2 Legally compelled disclosure. If the Receiving Party becomes legally compelled by subpoena, court order, or regulatory demand to disclose Confidential Information, it shall, to the extent legally permissible, provide prompt prior written notice to the Disclosing Party to permit protective relief, and shall disclose only the minimum portion legally required.

2.3 Federal DTSA statutory immunity notice. Pursuant to the Defend Trade Secrets Act of 2016 (18 U.S.C. § 1833(b)), an individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that is made in confidence to a federal, state, or local government official or to an attorney solely for the purpose of reporting or investigating a suspected violation of law, or in a complaint or other document filed under seal in a lawsuit or other proceeding.

ARTICLE III. TERM AND RETURN OF MATERIALS

3.1 Return or destruction. Upon termination of discussions or written request of the Disclosing Party, the Receiving Party shall promptly return or certify permanent destruction of all tangible Confidential Information and copies thereof, excluding routine automated archival backups retained under strict access controls.

3.2 Term and survival. Confidentiality obligations shall survive for {{CONFIDENTIALITY_YEARS}} years following the Effective Date; provided, however, that obligations governing trade secrets under applicable law shall continue for so long as such information remains a protectable trade secret.

ARTICLE IV. REMEDIES AND GENERAL PROVISIONS

4.1 Equitable relief. The Receiving Party acknowledges that unauthorized disclosure may cause irreparable injury for which monetary damages are inadequate, entitling the Disclosing Party to seek immediate injunctive or equitable relief without posting a bond, in addition to all remedies at law.

4.2 No license or warranty. Nothing herein grants any license, option, or Intellectual Property right, and all Confidential Information is provided "AS IS" without warranty as to accuracy or completeness. Neither Party assumes any obligation to enter into a definitive transaction.

4.3 Entire Agreement; severability; Governing Law. This Agreement constitutes the complete agreement between the Parties regarding confidentiality, may be amended only in a signed writing, may be executed in counterparts via electronic signature, and shall be governed by the laws of {{GOVERNING_STATE}}, without conflict-of-laws rules.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

FIRST PARTY:                           SECOND PARTY:
{{PARTY_A_NAME}}                       {{PARTY_B_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: ___________________________     Title: ___________________________
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'independent_contractor_agreement',
    title: 'Independent Contractor & IP Assignment Agreement',
    category: 'services',
    jurisdiction: 'United States Common Law / IRS 1099 Standards',
    description: 'United States 1099 independent contractor engagement agreement compliant with IRS classification rules, featuring irrevocable present assignment of IP ("hereby assigns") and 17 U.S.C. § 101 work-for-hire protections.',
    variables: [
      { key: 'COMPANY_NAME', label: 'Hiring Company Name', defaultValue: 'Summit FinTech Innovations Inc.', type: 'text' },
      { key: 'CONTRACTOR_NAME', label: 'Contractor Name / LLC', defaultValue: 'Jordan Vance Consulting LLC', type: 'text' },
      { key: 'SERVICES_DESC', label: 'Scope of Consulting Services', defaultValue: 'enterprise cloud architecture consulting and software delivery', type: 'text' },
      { key: 'FEE_RATE', label: 'Contract Fee / Rate ($)', defaultValue: '$185 per hour', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of California', type: 'text' }
    ],
    templateBody: `This consulting and assignment agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{COMPANY_NAME}} ("Company") and {{CONTRACTOR_NAME}} ("Contractor", and together with Company, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, Company desires to engage Contractor as an independent business contractor to perform specialized consulting services; and

WHEREAS, Contractor represents that it possesses the requisite expertise, licenses, and independent business infrastructure to render such services upon the terms set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. SERVICES AND INDEPENDENT CONTRACTOR STATUS

1.1 Engagement. Company hereby engages Contractor to provide {{SERVICES_DESC}} (the "Services"). Contractor shall control the means, methods, hours, and location of performance, subject to mutually agreed milestone schedules and deliverable quality standards.

1.2 Contractor classification. Contractor acts exclusively as an independent contractor under federal and state law and not as an employee, agent, joint venturer, or partner of Company. Contractor is ineligible for employee benefit plans, overtime, paid leave, or workers' compensation coverage, and assumes sole liability for all federal, state, and local income, self-employment, and payroll taxes reported via IRS Form 1099-NEC.

ARTICLE II. COMPENSATION AND INVOICING

2.1 Fees. In full consideration for the Services and Intellectual Property assignments hereunder, Company shall pay Contractor at the rate of {{FEE_RATE}}, payable net thirty (30) calendar days following Company's receipt of an itemized monthly invoice detailing hours worked and milestones achieved.

2.2 Expenses. Contractor shall bear its own overhead, insurance, equipment, and travel expenses unless pre-approved in writing by an authorized officer of Company.

ARTICLE III. INTELLECTUAL PROPERTY ASSIGNMENT AND CONFIDENTIALITY

3.1 Work made for hire and present assignment. All deliverables, inventions, software code, designs, documentation, and work product conceived or created by Contractor in performing the Services ("Work Product") shall constitute "works made for hire" under 17 U.S.C. § 101 to the fullest extent permitted by law. To the extent any Work Product does not qualify as a work made for hire, Contractor hereby irrevocably assigns, transfers, and conveys to Company all worldwide right, title, and interest in and to such Work Product, including all copyrights, patents, and trade secrets.

3.2 Waiver of moral rights and further assurances. Contractor waives all moral rights in the Work Product to the maximum extent permitted by law and agrees to execute all patent or copyright assignment instruments reasonably requested by Company. Contractor represents that no third-party open-source license imposing copyleft disclosure obligations shall be incorporated into Work Product without Company's prior written approval.

3.3 Confidentiality and DTSA immunity. Contractor shall hold all non-public Company information in strict confidence during and for five (5) years after termination (and indefinitely for trade secrets). Pursuant to 18 U.S.C. § 1833(b), Contractor is notified of statutory immunity for confidential disclosures of trade secrets made to government officials or attorneys solely to report suspected violations of law or in court filings under seal.

ARTICLE IV. INDEMNIFICATION, TERM, AND GENERAL PROVISIONS

4.1 Indemnification. Contractor shall indemnify and hold harmless Company from third-party claims, tax assessments, penalties, and Intellectual Property infringement liabilities arising from Contractor's breach of this Agreement, negligence, willful misconduct, or failure to remit required taxes.

4.2 Term and termination. Either Party may terminate this Agreement upon fourteen (14) calendar days' prior written notice, or immediately upon written notice for material breach. Upon termination, Company shall pay Contractor strictly for accepted Services rendered prior to termination.

4.3 Entire Agreement; severability; Governing Law. This Agreement constitutes the entire understanding of the Parties, supersedes all prior proposals, may be modified only in a signed writing, may be executed in counterparts via electronic signature, and shall be governed by the laws of {{GOVERNING_STATE}}, without conflict-of-laws rules.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

COMPANY:                               CONTRACTOR:
{{COMPANY_NAME}}                       {{CONTRACTOR_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: ___________________________     Title: Authorized Signatory
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'executive_employment_agreement',
    title: 'Senior Executive Employment Agreement',
    category: 'corporate',
    jurisdiction: 'State of New York / IRC Section 409A',
    description: 'C-suite employment agreement incorporating executive compensation, Cause/Good Reason termination definitions, severance conditioned upon general release, IRC Section 409A compliance, and invention assignment.',
    variables: [
      { key: 'EMPLOYER_NAME', label: 'Corporation Legal Name', defaultValue: 'Aegis BioSystems Corp.', type: 'text' },
      { key: 'EXECUTIVE_NAME', label: 'Executive Full Name', defaultValue: 'Victoria L. Sterling', type: 'text' },
      { key: 'POSITION_TITLE', label: 'Executive Officer Title', defaultValue: 'Chief Operating Officer', type: 'text' },
      { key: 'BASE_SALARY_NUM', label: 'Annual Base Salary ($)', defaultValue: '$385,000', type: 'text' },
      { key: 'BONUS_TARGET_PCT', label: 'Target Annual Bonus (%)', defaultValue: '40%', type: 'text' },
      { key: 'SEVERANCE_MONTHS', label: 'Severance Continuation (Months)', defaultValue: '12', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of New York', type: 'text' }
    ],
    templateBody: `This senior executive employment agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{EMPLOYER_NAME}} ("Company") and {{EXECUTIVE_NAME}} ("Executive", and together with Company, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, Company desires to employ Executive in an executive leadership capacity upon the terms and conditions set forth herein; and

WHEREAS, Executive desires to accept such employment and devote full professional time and skill to the advancement of Company's business.

NOW, THEREFORE, in consideration of the mutual covenants, compensation, and agreements contained herein, the receipt and adequacy of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. EMPLOYMENT, DUTIES, AND TERM

1.1 Position and duties. Company hereby employs Executive as {{POSITION_TITLE}}, reporting directly to the Chief Executive Officer or the Board of Directors. Executive shall exercise the authority and perform the duties customarily associated with such executive office.

1.2 Exclusive service. During employment, Executive shall devote full business time, loyalty, and best efforts to Company and shall not engage in any competing enterprise or outside board service without prior written consent of the Board of Directors.

ARTICLE II. COMPENSATION, BENEFITS, AND SECTION 409A

2.1 Base salary. Company shall pay Executive an annual salary of {{BASE_SALARY_NUM}} ("Base Salary"), less applicable tax withholdings, payable in regular payroll installments consistent with Company policy.

2.2 Annual performance bonus. Executive shall be eligible to earn an annual discretionary performance bonus targeted at {{BONUS_TARGET_PCT}} of Base Salary, based upon achievement of corporate and individual objectives established by the Board of Directors.

2.3 Benefits and expense reimbursement. Executive shall be entitled to participate in all executive health, retirement, and paid-time-off benefit programs maintained by Company, plus reimbursement of documented business expenses under Company policy.

2.4 Tax deferral compliance. All payments hereunder are intended to comply with or be exempt from 26 U.S.C. § 409A of the Internal Revenue Code, and this Agreement shall be administered accordingly. If Executive is a specified employee upon separation from service, any non-exempt deferred compensation payable upon separation shall be delayed six (6) months as mandated by 26 U.S.C. § 409A(a)(2)(B)(i).

ARTICLE III. TERMINATION AND SEVERANCE

3.1 Grounds for termination. Employment may be terminated: (a) by Company for "Cause" (meaning willful misconduct, felony conviction, material fraud, or persistent uncured failure to perform lawful executive duties after fifteen (15) days' written notice); (b) by Company without Cause; (c) by Executive for constructive termination ("Good Reason"), meaning a material uncured reduction in Base Salary, authority, or principal work location exceeding fifty (50) miles; or (d) upon death or permanent disability.

3.2 Severance benefits. If Company terminates Executive without Cause or Executive resigns for Good Reason, Company shall pay Executive: (a) all accrued unpaid salary and vested benefits; and (b) salary continuation equal to {{SEVERANCE_MONTHS}} months of Executive's then-current Base Salary, conditioned strictly upon Executive executing and not revoking a customary general release of claims within forty-five (45) days following termination.

ARTICLE IV. RESTRICTIVE COVENANTS AND GENERAL PROVISIONS

4.1 Confidentiality and inventions assignment. Executive acknowledges ongoing fiduciary obligations regarding Company trade secrets and Confidential Information, hereby assigns all inventions conceived during employment within Company's business scope, and acknowledges federal whistleblower immunity notice under 18 U.S.C. § 1833(b).

4.2 Non-solicitation. For twelve (12) months following termination of employment for any reason, Executive shall not directly or indirectly solicit for employment or engagement any employee or key customer of Company with whom Executive worked during the final year of employment.

4.3 Notices; Entire Agreement; Governing Law. All notices shall be in writing via nationally recognized overnight courier or certified mail. This Agreement supersedes all prior employment offers, may be amended only in a writing signed by each Party, may be executed in counterparts via electronic signature, and shall be governed by the laws of {{GOVERNING_STATE}}, without regard to conflict-of-laws principles.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

COMPANY:                               EXECUTIVE:
{{EMPLOYER_NAME}}                      {{EXECUTIVE_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: {{EXECUTIVE_NAME}}
Title: Authorized Officer              Title: {{POSITION_TITLE}}
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'commercial_promissory_note',
    title: 'Secured Commercial Promissory Note',
    category: 'finance',
    jurisdiction: 'State of New York / UCC Article 9 Secured Transactions',
    description: 'Institutional commercial secured promissory note featuring UCC Article 9 collateral grant, automatic acceleration upon default, prepayment privilege, usury savings clause, and collection fee recovery.',
    variables: [
      { key: 'BORROWER_NAME', label: 'Borrower / Maker Entity', defaultValue: 'Northstar Logistics Group LLC', type: 'text' },
      { key: 'LENDER_NAME', label: 'Lender / Holder Entity', defaultValue: 'Sterling Capital Credit Partners LP', type: 'text' },
      { key: 'PRINCIPAL_AMOUNT_WORDS', label: 'Principal Sum (Words)', defaultValue: 'five hundred thousand dollars', type: 'text' },
      { key: 'PRINCIPAL_AMOUNT_NUM', label: 'Principal Sum ($)', defaultValue: '$500,000', type: 'text' },
      { key: 'INTEREST_RATE', label: 'Annual Fixed Interest Rate (%)', defaultValue: '7.50%', type: 'text' },
      { key: 'DEFAULT_RATE', label: 'Default Interest Rate (%)', defaultValue: '12.00%', type: 'text' },
      { key: 'MATURITY_DATE', label: 'Final Maturity Date', defaultValue: 'July 1, 2029', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of New York', type: 'text' }
    ],
    templateBody: `PRINCIPAL AMOUNT: {{PRINCIPAL_AMOUNT_NUM}}       EFFECTIVE DATE: {{EFFECTIVE_DATE}}
INTEREST RATE: {{INTEREST_RATE}} PER ANNUM     MATURITY DATE: {{MATURITY_DATE}}

FOR VALUE RECEIVED, {{BORROWER_NAME}} ("Maker"), hereby unconditionally promises to pay to the order of {{LENDER_NAME}} ("Holder"), at Holder's designated office or such other place as Holder may designate in writing, in lawful money of the United States of America and immediately available funds, the principal sum of {{PRINCIPAL_AMOUNT_WORDS}} ({{PRINCIPAL_AMOUNT_NUM}}), together with accrued interest thereon at the rate and upon the terms set forth in this secured commercial promissory note (this "Note").

ARTICLE I. PAYMENT OF PRINCIPAL AND INTEREST

1.1 Interest and amortization. Unpaid principal under this Note shall bear fixed simple interest from the Effective Date until paid in full at {{INTEREST_RATE}} per annum, computed on the basis of a 365-day year for actual days elapsed. Accrued interest shall be payable quarterly in arrears on the first business day of each calendar quarter, and the entire unpaid principal balance plus all accrued unpaid interest shall be due and payable in full on {{MATURITY_DATE}} (the "Maturity Date").

1.2 Prepayment privilege. Maker may prepay the principal balance of this Note, in whole or in part, at any time without penalty or premium, provided any partial prepayment is accompanied by accrued interest through the prepayment date.

ARTICLE II. UCC ARTICLE 9 SECURITY INTEREST

2.1 Grant of collateral security. As continuing collateral security for the prompt payment and performance of all obligations under this Note, Maker hereby grants to Holder a continuing first-priority security interest under Article 9 of the Uniform Commercial Code ("UCC") in all accounts receivable, equipment, inventory, general intangibles, and cash proceeds of Maker (collectively, the "Collateral").

2.2 UCC financing statements. Maker irrevocably authorizes Holder to file UCC-1 financing statements and continuation statements in any applicable filing office to perfect and maintain Holder's security interest in the Collateral.

ARTICLE III. EVENTS OF DEFAULT AND REMEDIES

3.1 Events of Default. Each of the following constitutes an "Event of Default": (a) failure by Maker to pay any principal or interest installment within five (5) business days after due; (b) breach of any non-monetary covenant uncured for fifteen (15) days after written notice; (c) insolvency, assignment for the benefit of creditors, or bankruptcy filing by or against Maker; or (d) unauthorized transfer or encumbrance of material Collateral.

3.2 Acceleration and default rate. Upon any Event of Default, Holder may declare the entire unpaid principal balance and all accrued interest immediately due and payable without presentment, demand, protest, or further notice (all of which Maker hereby waives), and all overdue amounts shall bear interest at {{DEFAULT_RATE}} per annum until satisfied in full.

3.3 Collection costs. Maker shall pay all reasonable out-of-pocket costs of collection, including reasonable attorneys' fees and court costs, incurred by Holder in enforcing this Note or realizing upon the Collateral.

ARTICLE IV. USURY SAVINGS AND GENERAL PROVISIONS

4.1 Usury savings clause. Nothing in this Note shall require payment of interest in excess of the maximum non-usurious rate permitted by applicable law; any excess interest collected shall be credited automatically to unpaid principal or refunded to Maker.

4.2 Waivers and Governing Law. Presentment, protest, and notice of dishonor are waived by Maker. No amendment or waiver shall bind Holder unless in a signed writing. This Note shall be governed by the laws of {{GOVERNING_STATE}}, without conflict-of-laws principles, and Maker irrevocably waives trial by jury in any enforcement action.

IN WITNESS WHEREOF, Maker has duly executed and delivered this Note as of the Effective Date first written above.

MAKER:                                 ACCEPTED AND ACKNOWLEDGED BY HOLDER:
{{BORROWER_NAME}}                      {{LENDER_NAME}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: Authorized Signatory            Title: Authorized Signatory
Date: ____________________________     Date: ____________________________`
  },
  {
    id: 'settlement_and_release_agreement',
    title: 'Confidential Settlement and Mutual General Release Agreement',
    category: 'dispute',
    jurisdiction: 'State of California / Federal Litigation Practice',
    description: 'Comprehensive dispute resolution settlement contract featuring lump-sum consideration, strict no-admission clause, mutual general release, California Civil Code Section 1542 unknown-claims waiver, and confidentiality.',
    variables: [
      { key: 'FIRST_PARTY', label: 'Claimant / Releasing Party', defaultValue: 'Apex Distribution Partners LLC', type: 'text' },
      { key: 'SECOND_PARTY', label: 'Respondent / Paying Party', defaultValue: 'Continental Logistics Corp.', type: 'text' },
      { key: 'DISPUTE_MATTER', label: 'Subject Matter / Case Reference', defaultValue: 'commercial supply-chain fee and breach dispute dated March 2026', type: 'text' },
      { key: 'SETTLEMENT_AMOUNT_WORDS', label: 'Settlement Sum (Words)', defaultValue: 'one hundred twenty-five thousand dollars', type: 'text' },
      { key: 'SETTLEMENT_AMOUNT_NUM', label: 'Settlement Sum ($)', defaultValue: '$125,000', type: 'text' },
      { key: 'PAYMENT_DAYS', label: 'Payment Wire Window (Days)', defaultValue: '10', type: 'text' },
      { key: 'GOVERNING_STATE', label: 'Governing Law State', defaultValue: 'State of California', type: 'text' }
    ],
    templateBody: `This settlement and mutual release agreement (this "Agreement") is made and entered into as of {{EFFECTIVE_DATE}} (the "Effective Date"), by and between {{FIRST_PARTY}} ("First Party") and {{SECOND_PARTY}} ("Second Party", and together with First Party, each a "Party" and collectively the "Parties").

RECITALS

WHEREAS, certain disputes and claims have arisen between the Parties concerning the {{DISPUTE_MATTER}} (collectively, the "Dispute"); and

WHEREAS, without admitting fault, liability, or wrongdoing of any kind, the Parties desire fully, finally, and amicably to compromise, settle, and release all claims arising out of or relating to the Dispute upon the terms set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants, releases, and settlement consideration set forth herein, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

ARTICLE I. SETTLEMENT PAYMENT AND NON-ADMISSION

1.1 Settlement consideration. Within {{PAYMENT_DAYS}} business days following full execution of this Agreement and receipt of a completed IRS Form W-9 from First Party, Second Party shall pay First Party the lump sum of {{SETTLEMENT_AMOUNT_WORDS}} ({{SETTLEMENT_AMOUNT_NUM}}) by wire transfer of immediately available funds (the "Settlement Payment").

1.2 Tax responsibility. First Party shall be solely responsible for all federal, state, and local taxes, if any, attributable to receipt of the Settlement Payment, and Second Party makes no representation regarding tax characterization thereof.

1.3 No admission of liability. This Agreement represents a compromise of disputed claims. Neither the execution of this Agreement nor payment of the Settlement Payment shall be construed as an admission of liability, breach, or wrongdoing by either Party, each of whom expressly denies any such liability.

ARTICLE II. MUTUAL GENERAL RELEASE AND STATUTORY WAIVER

2.1 Mutual general release. Effective upon receipt of the Settlement Payment, each Party, on behalf of itself and its respective officers, directors, members, affiliates, successors, and assigns, hereby irrevocably releases and forever discharges the other Party and its respective officers, directors, employees, insurers, attorneys, and assigns from any and all claims, demands, causes of action, damages, costs, and liabilities of any nature, whether known or unknown, suspected or unsuspected, arising from the beginning of time through the Effective Date relating to the Dispute; provided, however, that nothing herein releases any obligation arising under this Agreement.

2.2 Unknown claims waiver. EACH PARTY EXPRESSLY WAIVES AND RELINQUISHES ALL RIGHTS AND BENEFITS AFFORDED BY CALIFORNIA CIVIL CODE § 1542 (AND ANY ANALOGOUS STATUTE OR COMMON-LAW PRINCIPLE IN ANY JURISDICTION), WHICH PROVIDES AS FOLLOWS: "A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS THAT THE CREDITOR OR RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING THE RELEASE AND THAT, IF KNOWN BY HIM OR HER, WOULD HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE DEBTOR OR RELEASED PARTY."

ARTICLE III. CONFIDENTIALITY AND GENERAL PROVISIONS

3.1 Strict confidentiality. Except as required by court order, tax reporting, or enforcement of this Agreement, each Party shall keep the terms, settlement amount, and existence of this Agreement strictly confidential, and may state solely that the Dispute was resolved to the mutual satisfaction of the Parties.

3.2 Mutual non-disparagement. Each Party agrees not to make any false, defamatory, or disparaging statements regarding the other Party or its business reputation, products, or leadership.

3.3 Entire Agreement and Governing Law. Each Party acknowledges that it has had the opportunity to review this Agreement with independent legal counsel of its choosing. This Agreement constitutes the entire understanding of the Parties, may be amended only in a signed writing, may be executed in counterparts via electronic signature, and shall be governed by the laws of {{GOVERNING_STATE}}, without regard to conflict-of-laws rules. In any action to enforce this Agreement, the prevailing Party shall recover reasonable attorneys' fees and costs.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.

FIRST PARTY:                           SECOND PARTY:
{{FIRST_PARTY}}                        {{SECOND_PARTY}}

By: ______________________________     By: ______________________________
Name: ____________________________     Name: ____________________________
Title: ___________________________     Title: ___________________________
Date: ____________________________     Date: ____________________________`
  }
];

export const STATE_SPECIFIC_RIDERS = {
  general: {
    id: 'general',
    name: 'Standard US Baseline (No State Rider)',
    shortName: 'US Baseline',
    badge: 'UCC / Common Law',
    legalReason: 'Uniform commercial real estate drafting without state-specific statutory addenda.',
    riderClause: ''
  },
  california: {
    id: 'california',
    name: 'California Statutory Addendum (Cal. Civ. Code § 1671)',
    shortName: 'California (CA)',
    badge: 'Cal. Civ. Code §§ 1671 / 1103',
    defaults: { GOVERNING_STATE: 'State of California', VENUE_COUNTY: 'Superior Court of California' },
    legalReason: 'Mandatory Cal. Civ. Code § 1677(b) separate-initials liquidated damages enforceability and Natural Hazard Disclosure (NHD) compliance.',
    riderClause: `ADDENDUM A. CALIFORNIA STATUTORY REAL ESTATE RIDER

A.1 Liquidated damages statutory notice. BY INITIALING BELOW, BUYER AND SELLER EXPRESSLY AGREE THAT THE RETENTION OF EARNEST MONEY AS LIQUIDATED DAMAGES UNDER THIS AGREEMENT IS REASONABLE UNDER CALIFORNIA CIVIL CODE §§ 1671 AND 1677, AND SHALL CONSTITUTE SELLER'S SOLE MONETARY REMEDY FOR BUYER'S BREACH OF OBLIGATION TO PURCHASE, EXCEPT WITH RESPECT TO BUYER'S EXPRESS INDEMNIFICATION AND SURVIVING OBLIGATIONS HEREUNDER.
Seller initials: _________    Buyer initials: _________

A.2 Environmental and hazard disclosures. Seller shall timely furnish a statutory natural hazard disclosure statement pursuant to California Civil Code § 1103 et seq. and comply with applicable seismic, wildfire, and environmental transfer disclosures.`
  },
  texas: {
    id: 'texas',
    name: 'Texas Statutory Addendum (Tex. Prop. Code § 5.014)',
    shortName: 'Texas (TX)',
    badge: 'Tex. Prop. Code / TREC Baseline',
    defaults: { GOVERNING_STATE: 'State of Texas', VENUE_COUNTY: 'District Courts of Texas' },
    legalReason: 'Incorporates mandatory Texas Municipal Utility District (MUD) notice, statutory POA disclosures, and independent option-fee consideration enforceability.',
    riderClause: `ADDENDUM A. TEXAS STATUTORY REAL ESTATE RIDER

A.1 Independent option fee consideration. A non-refundable sum of one hundred dollars ($100.00) out of the Earnest Money is hereby allocated as independent consideration paid by Buyer to Seller for Buyer's unrestricted right to inspect and terminate during the Inspection Period under Texas contract law.

A.2 Statutory utility and district notices. Seller shall deliver written statutory notices regarding any municipal utility district pursuant to Texas water code § 49.452, public improvement district assessments under Texas property code § 5.014, and property owners association disclosures where applicable.`
  },
  new_york: {
    id: 'new_york',
    name: 'New York Statutory Addendum (NY RPL § 258)',
    shortName: 'New York (NY)',
    badge: 'NY GOL § 5-703 / Attorney Review',
    defaults: { GOVERNING_STATE: 'State of New York', VENUE_COUNTY: 'Supreme Court of the State of New York' },
    legalReason: 'Incorporates New York Statute of Frauds compliance, Bargain and Sale Deed with Covenant Against Grantor Acts, and local transfer tax allocation rules.',
    riderClause: `ADDENDUM A. NEW YORK STATUTORY REAL ESTATE RIDER

A.1 Deed form and transfer taxes. Title conveyance at Closing shall be effected by a duly acknowledged bargain and sale deed with covenant against grantor acts pursuant to New York real property law § 258. Seller shall execute and remit New York real estate transfer tax filings and transfer taxes, while Buyer shall remain solely responsible for any applicable mansion tax under New York tax law § 1402-a.

A.2 Writing requirement. Pursuant to New York general obligations law § 5-703, neither this Agreement nor any modification hereof shall be enforceable unless executed in a writing subscribed by the Party to be charged.`
  },
  florida: {
    id: 'florida',
    name: 'Florida Statutory Addendum (Fla. Stat. § 404.056)',
    shortName: 'Florida (FL)',
    badge: 'Fla. Stat. §§ 404.056 / 689.261',
    defaults: { GOVERNING_STATE: 'State of Florida', VENUE_COUNTY: 'Circuit Courts of Florida' },
    legalReason: 'Incorporates mandatory Florida statutory Radon Gas health notice and Fla. Stat. § 689.261 property tax reassessment summary.',
    riderClause: `ADDENDUM A. FLORIDA STATUTORY REAL ESTATE RIDER

A.1 Radon statutory notice. Pursuant to Florida statutes § 404.056(5), radon is a naturally occurring radioactive gas that, when it has accumulated in a building in sufficient quantities, may present health risks to persons who are exposed to it over time. Levels of radon that exceed federal and state guidelines have been found in buildings in Florida, and additional information regarding radon and radon testing may be obtained from the county health department.

A.2 Property tax disclosure summary. Pursuant to Florida statutes § 689.261, BUYER SHOULD NOT RELY ON THE SELLER'S CURRENT PROPERTY TAXES AS THE AMOUNT OF PROPERTY TAXES THAT THE BUYER MAY BE OBLIGATED TO PAY IN THE YEAR SUBSEQUENT TO PURCHASE. A CHANGE OF OWNERSHIP OR PROPERTY IMPROVEMENTS TRIGGERS REASSESSMENTS OF THE PROPERTY THAT COULD RESULT IN HIGHER PROPERTY TAXES.`
  }
};

/**
 * Compiles a template by substituting variable placeholders and optionally appending state-specific statutory riders.
 *
 * @param {Object} template - The template object from LEGAL_TEMPLATES
 * @param {Object} variablesValues - Map of { VAR_KEY: string }
 * @param {Object} [options] - Compilation options ({ stateRider?: string })
 * @returns {string} Fully compiled formal agreement text
 */
export function compileTemplateText(template, variablesValues = {}, options = {}) {
  if (!template) return '';
  let compiled = template.templateBody;

  const effectiveDate = variablesValues.EFFECTIVE_DATE || new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  compiled = compiled.replace(/\{\{EFFECTIVE_DATE\}\}/g, effectiveDate);

  (template.variables || []).forEach(v => {
    const val = variablesValues[v.key] !== undefined && variablesValues[v.key] !== ''
      ? variablesValues[v.key]
      : v.defaultValue;
    const regex = new RegExp(`\\{\\{${v.key}\\}\\}`, 'g');
    compiled = compiled.replace(regex, val);
  });

  // Inject State-Specific Real Estate Statutory Rider if requested
  const riderKey = options.stateRider || 'general';
  const rider = STATE_SPECIFIC_RIDERS[riderKey];
  if (rider && rider.riderClause && template.category === 'real_estate') {
    const markerWitness = 'IN WITNESS WHEREOF';
    const markerLOI = 'ACKNOWLEDGED AND AGREED';
    if (compiled.includes(markerWitness)) {
      compiled = compiled.replace(markerWitness, `${rider.riderClause}\n\n${markerWitness}`);
    } else if (compiled.includes(markerLOI)) {
      compiled = compiled.replace(markerLOI, `${rider.riderClause}\n\n${markerLOI}`);
    } else {
      compiled = `${compiled}\n\n${rider.riderClause}`;
    }
  }

  return compiled;
}
