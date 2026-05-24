/*
  §160 — Rapid Hire Solutions API v2 reference data model.

  This module is the single source of truth that powers both the
  /integrations in-page API reference section and the downloadable
  API documentation PDF (see @/lib/apiDocsPdf). The data is
  derived from the canonical reference at
  https://clients.rapidhiresolutions.com/docs — re-running
  scripts/build_api_ref.py regenerates this file from a fresh
  scrape.

  IMPORTANT: edit scripts/build_api_ref.py and the scraped JSON,
  not this file directly — a manual edit will be overwritten the
  next time the reference is regenerated.
*/

export type ApiEndpoint = {
  verb: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
};

export type ApiResource = {
  /** lowercase URL-friendly id, e.g. "healthscreenings" */
  slug: string;
  /** human-readable name, e.g. "Health Screenings" */
  name: string;
  /** one-sentence summary used on the index card */
  shortDescription: string;
  /** structured list of verb + path pairs */
  endpoints: ApiEndpoint[];
  /** verbatim Markdown documentation for this resource */
  markdown: string;
};

export const API_HOST_PRODUCTION =
  "https://clients.rapidhiresolutions.com/api2";
export const API_HOST_STAGING =
  "https://clients.rapidhiresolutions.com/staging/api2";

export const API_OVERVIEW = {
  version: "v2",
  name: "Rapid Hire Solutions API",
  summary:
    "Version 2 of the Rapid Hire Solutions API is fully REST compliant. It was built around modern programming practices so the learning curve stays short.",
  transport:
    "All API requests must be made over HTTPS. Plain HTTP is not supported.",
  authentication:
    "HTTP Basic authentication. Use your Rapid Hire Solutions login credentials as the username/password pair on every request.",
  sampleCurl:
    "curl -X GET --user user:password https://clients.rapidhiresolutions.com/api2/packages",
} as const;

export const API_RESOURCES: ApiResource[] = [
  {
    slug: "branches",
    name: "Branches",
    shortDescription: "This resource allows users to list all client branches enabled for their account.",
    endpoints: [
      { verb: "GET", path: "/branches" },
    ],
    markdown: `## Rapid Hire Solutions API v2

### GET /branches

#### List client branches enabled for this user.

##### Example Request

\`\`\`
	 curl -X GET --user name:password https://clients.rapidhiresolutions.com/api2/branches
\`\`\`

List all searches available to order for client account.

#### Example Response

\`\`\`
								 
{
  "status": 0,
  "description": "Branch(es) found.",
  "payload": [
    {
      "ID": "0",
      "Name": "Main"
    },
    {
      "ID": "367",
      "Name": "Honduras Branch"
    },
    {
      "ID": "513",
      "Name": "Houston"
    },
    {
      "ID": "514",
      "Name": "San Antonio"
    },
    {
      "ID": "515",
      "Name": "Austin"
    }
  ]
}
\`\`\``,
  },
  {
    slug: "clients",
    name: "Clients",
    shortDescription: "List client details for this user.",
    endpoints: [
      { verb: "GET", path: "/clients" },
    ],
    markdown: `### GET /clients

#### List client details for this user.

##### Example Request

\`\`\`
	curl -X GET --user name:password https://clients.rapidhiresolutions.com/api2/clients
	
	
\`\`\`

List attributes for this client.

#### [Example Response](#collapse1)

\`\`\`
								
{
  "status": 0,
  "description": "Client found.",
  "payload": {
    "id": "2",
    "companyname": "PH Test Account",
    "thirdpartyuniqueid": "UniqueID1234"
  }
}								
							
\`\`\``,
  },
  {
    slug: "counties",
    name: "Counties",
    shortDescription: "The Counties resource provides an endpoint to retrieve a comprehensive list of all counties within a specified US state.",
    endpoints: [
      { verb: "GET", path: "/counties/{stateabbreviation}" },
    ],
    markdown: `### GET /counties/ {state abbreviation}

#### List all counties in a given state.

List all counties in a given state.

##### Parameters

**state abbreviation**

required

\`string\`

Formal two letter US GET Office state abbreviation of requested county list

##### Example Request

\`\`\`
	 curl -X GET --user name:password https://clients.rapidhiresolutions.com/api2/counties/hi
\`\`\`

##### Example Response

* 200 OK

\`\`\`
				 
{
  "status": 0,
  "description": "County list returned.",
  "payload": [
    {
      "CountyID": "544",
      "CountyName": "Hawaii",
      "StateName": "Hawaii",
      "FIPSCode": "15001",
      "StateAbbreviation": "HI"
    },
    {
      "CountyID": "545",
      "CountyName": "Honolulu",
      "StateName": "Hawaii",
      "FIPSCode": "15003",
      "StateAbbreviation": "HI"
    },
    {
      "CountyID": "546",
      "CountyName": "Kauai",
      "StateName": "Hawaii",
      "FIPSCode": "15007",
      "StateAbbreviation": "HI"
    },
    {
      "CountyID": "547",
      "CountyName": "Maui",
      "StateName": "Hawaii",
      "FIPSCode": "15009",
      "StateAbbreviation": "HI"
    }
  ]
}
\`\`\``,
  },
  {
    slug: "healthscreenings",
    name: "Health Screenings",
    shortDescription: "This resource allows users to retrieve a list of active health screening orders and initiate the rescheduling of existing health screenings.",
    endpoints: [
      { verb: "GET", path: "/healthscreenings" },
      { verb: "POST", path: "/healthscreenings" },
    ],
    markdown: `## Rapid Hire Solutions API v2

### GET /healthscreenings

#### Get a list of active health screening orders.

Get a list of active health screening orders.

#### Example Response

\`\`\`json
{
  "status": 0,
  "description": "Screening list returned.",
  "payload": [
		{
		  "firstname": "Someplace",
		  "lastname": "Somewhere",
		  "searchname": "eCup - 5-Panel Instant",
		  "id": "2327814",
		  "status": "Pending",
		  "date": "2019-01-03 13:29:05",
		  "zipcode": "17602",
		  "closedate": "0000-00-00 00:00:00",
		  "email": "someplacesomewhere@gmail.com",
		  "reportID": "477985"
		},
		{
		  "id": "2331402",
		  "status": "Pending",
		  "date": "2019-01-07 11:39:04",
		  "zipcode": "32209",
		  "closedate": "0000-00-00 00:00:00",
		  "email": "someplacesomewhere@gmail.com",
		  "reportID": "478728"
		}
	]
}
\`\`\`

### POST /healthscreenings

#### Initiate rescheduling of health screening.

Initiate rescheduling of health screening.

##### Example Request

\`\`\`json
{
	"id":"2327814",
	"action":"reschedule"
}
\`\`\`

#### Example Response

\`\`\`json
{
  "status": 0,
  "description": "Reschedule failed",
  "payload": false
}
\`\`\``,
  },
  {
    slug: "invitations",
    name: "Invitations",
    shortDescription: "The Invitations resource allows users to retrieve a list of active invitation orders and resend invitations to applicants.",
    endpoints: [
      { verb: "GET", path: "/invitations" },
      { verb: "POST", path: "/invitations" },
    ],
    markdown: `### GET /invitations

#### Get a list of active invitation orders.

Get a list of active invitation orders.

#### Example Response

\`\`\`
								 
{
  "status": 0,
  "description": "Invitation list returned.",
  "payload": [
    {
      "ID": "18435",
      "ApplicantName": "Mark Colbath",
      "ApplicantEmail": "colbathmark@gmail.com",
      "ApplicantCell": "5129618646",
      "Status": "sent",
      "SignDate": "1969-12-31 18:00:00",
      "OrderID": null,
      "DateCreated": "2019-01-03 12:42:45"
    },
    {
      "ID": "18436",
      "ApplicantName": "Mark Colbath",
      "ApplicantEmail": "colbathmark@gmail.com",
      "ApplicantCell": "5129618646",
      "Status": "sent",
      "SignDate": "1969-12-31 18:00:00",
      "OrderID": null,
      "DateCreated": "2019-01-03 12:45:14"
    }
  ]
}
\`\`\`

### POST /invitations

#### Resend an invitation to applicant.

Resend an invitation to applicant.

##### Example Request

\`\`\`
				 
{
	"ID":"18435",
	"ApplicantName":"Mark Colbath",
	"ApplicantEmail":"colbathmark@gmail.com",
	"ApplicantCell":"5129618646",
	"Status":"sent",
	"SignDate":"1969-12-31 18:00:00",
	"OrderID":null,
	"DateCreated":"2019-01-03 12:42:45",
	"action":"resend"
}
\`\`\`

#### Example Response

\`\`\`
								 
{
  "status": 0,
  "description": "Invitations resent",
  "payload": true
}
\`\`\``,
  },
  {
    slug: "orders",
    name: "Orders",
    shortDescription: "Create new order or order price quote.",
    endpoints: [
      { verb: "POST", path: "/orders" },
      { verb: "GET", path: "/orders/:id" },
    ],
    markdown: `### POST /orders



#### Create new order or order price quote.

Create new order or order price quote.



##### Example Request

\`\`\`
				
{
	"applicantinfo":
	{"firstname":"John","lastname":"Doe","middlename":"D","generation":"III","SSN":"123-45-6789","DOB":"01\\/01\\/1970"},
	"appendtoorderid":1234,
	"autopopulate":"SSN",
	"pricequote":false,
	"product":
	[
		{"SearchCode":"EM","parameters":
		{"companyname":"Beer Buds","state":"TX","telephone":"867-5309","positionheld":"Sr. Vice President","salary":"400K","employmentdates":"10\\/05-12\\/16","employmentcity":"Austin","reasonforleaving":"Boss tried to kill me"}},
		{"SearchCode":"EV","parameters":
		{"schoolname":"University of Texas At Austin","campusname":"Austin","courseofstudy":"CS","graduated":"Y","attendancedates":"9\\/85-12\\/89","degree":"BA","schoolcity":"Austin","schoolstate":"TX","schoolcountry":"USA"}},
		{"SearchCode":"PLV","parameters":
		{"Agency":"TIB","Typeoflicense":"Insurance","stateissued":"TX"}},
		{"SearchCode":"MVR","parameters":{"state":"TX","Licensenumber":"5"}}
	],
	"postbackurl":"https://somedomain.com/somepath"
}
	
\`\`\`

#### [Example Response](#collapse1)

\`\`\`
								
{
  "status": 0,
  "description": "Orders returned.",
  "payload": {
    "applicantinfo": {
      "firstname": "John",
      "lastname": "Doe",
      "SSN": "123-45-6789",
      "DOB": "01\\/01\\/1970"
    },
    "autopopulate": "SSN",
    "pricequote": false,
    "product": [
      {
        "SearchCode": "EM",
        "parameters": {
          "companyname": "Beer Buds",
          "state": "TX",
          "telephone": "867-5309",
          "positionheld": "Sr. Vice President",
          "salary": "400K",
          "employmentdates": "10\\/05-12\\/16",
          "employmentcity": "Austin",
          "reasonforleaving": "Boss tried to kill me"
        },
        "AreaType": "N",
        "productID": "7",
        "searchID": 1632994
      },
      {
        "SearchCode": "EV",
        "parameters": {
          "schoolname": "University of Texas At Austin",
          "campusname": "Austin",
          "courseofstudy": "CS",
          "graduated": "Y",
          "attendancedates": "9\\/85-12\\/89",
          "degree": "BA",
          "schoolcity": "Austin",
          "schoolstate": "TX",
          "schoolcountry": "USA"
        },
        "AreaType": "N",
        "productID": "17",
        "searchID": 1632995
      },
      {
        "SearchCode": "PLV",
        "parameters": {
          "agency": "TIB",
          "typeoflicense": "Insurance",
          "stateissued": "TX"
        },
        "AreaType": "N",
        "productID": "34",
        "searchID": 1632996
      },
      {
        "SearchCode": "MVR",
        "parameters": {
          "state": "TX",
          "licensenumber": "5"
        },
        "location": {
          "state": "Texas",
          "stateID": "44",
          "county": "",
          "countyID": 0
        },
        "productID": "11",
        "searchID": 1632997
      }
    ],
    "userid": "10",
    "checkoutStatus": {
      "status": 1
    },
    "price": {
      "basePrice": null,
      "alaCarteSubtotal": 50.66,
      "package": [
        
      ],
      "alaCarteItem": [
        {
          "SearchCode": "EM",
          "parameters": {
            "companyname": "Beer Buds",
            "state": "TX",
            "telephone": "867-5309",
            "positionheld": "Sr. Vice President",
            "salary": "400K",
            "employmentdates": "10\\/05-12\\/16",
            "employmentcity": "Austin",
            "reasonforleaving": "Boss tried to kill me"
          },
          "AreaType": "N",
          "productID": "7",
          "price": 8
        },
        {
          "SearchCode": "EV",
          "parameters": {
            "schoolname": "University of Texas At Austin",
            "campusname": "Austin",
            "courseofstudy": "CS",
            "graduated": "Y",
            "attendancedates": "9\\/85-12\\/89",
            "degree": "BA",
            "schoolcity": "Austin",
            "schoolstate": "TX",
            "schoolcountry": "USA"
          },
          "AreaType": "N",
          "productID": "17",
          "price": 22.16
        },
        {
          "SearchCode": "PLV",
          "parameters": {
            "agency": "TIB",
            "typeoflicense": "Insurance",
            "stateissued": "TX"
          },
          "AreaType": "N",
          "productID": "34",
          "price": 8
        },
        {
          "SearchCode": "MVR",
          "parameters": {
            "state": "TX",
            "licensenumber": "5"
          },
          "location": {
            "state": "Texas",
            "stateID": "44",
            "county": "",
            "countyID": 0
          },
          "productID": "11",
          "price": 12.5
        }
      ],
      "total": 50.66
    },
    "paymentStatus": "paymentMade",
    "orderID": 342742
  }
}
								
							
\`\`\`

##### Example Request, Package Order

\`\`\`
				
{
	"applicantinfo":
	{"firstname":"Dewayne","middlename":"","lastname":"Johnson"},
	"invitation":1,
	"author":"someusername",
	"packageid":9999,
	"pricequote":false,
	"applicantemail":"therock@gmail.com",
	"branchid":0,
	"templateID":1234
}
	
\`\`\`

#### [Example Response](#collapse2)

\`\`\`
								
{
  "status": 0,
  "description": "Orders returned.",
  "payload": {
    "applicantinfo": {
      "firstname": "Dewayne",
      "middlename": "",
      "lastname": "Johnson"
    },
    "invitation": 1,
    "packageid": 1559,
    "pricequote": false,
    "email": "therock@gmail.com",
    "branchid": 0,
    "userid": "10",
    "autopopulate": "SSN",
    "checkoutStatus": {
      "status": 1
    },
    "product": [
      {
        "quantity": "1",
        "name": "County Criminal",
        "SearchCode": "CC",
        "pid": "6",
        "area": "C",
        "type": "5",
        "Done": 0,
        "AreaType": "C"
      },
      {
        "quantity": "1",
        "name": "Nationwide Federal Criminal Search",
        "SearchCode": "NFC",
        "pid": "24",
        "area": "N",
        "type": "5",
        "Done": 0,
        "AreaType": "N"
      },
      {
        "quantity": "1",
        "name": "SSN Trace\\/Address History",
        "SearchCode": "SSN",
        "pid": "36",
        "area": "N",
        "type": "14",
        "Done": 0,
        "AreaType": "N"
      },
      {
        "quantity": "1",
        "name": "Nationwide Criminal\\/OFAC\\/OIG\\/Sex Offender",
        "SearchCode": "NCOFACSO",
        "pid": "66",
        "area": "N",
        "type": "5",
        "Done": 0,
        "AreaType": "N"
      },
      {
        "quantity": "1",
        "name": "Office of Inspector General (OIG)",
        "SearchCode": "OIG",
        "pid": "67",
        "area": "N",
        "type": "17",
        "Done": 0,
        "AreaType": "N"
      },
      {
        "quantity": "1",
        "name": "Excluded Parties List System Search",
        "SearchCode": "EPLSS",
        "pid": "76",
        "area": "N",
        "type": "5",
        "Done": 0,
        "AreaType": "N"
      },
      {
        "quantity": "1",
        "name": "Specialty Designated Nationals (SDN)",
        "SearchCode": "SDN",
        "pid": "81",
        "area": "N",
        "type": "5",
        "Done": 0,
        "AreaType": "N"
      }
    ],
    "result": {
      "status": "Invitation created and sent.",
      "invitationID": 125137,
      "statusCode": 1
    }
  }
}

							
\`\`\`

##### Example Request, Alias Order

\`\`\`
				
{
	"applicantinfo":
	{"firstname":"John","lastname":"Doe","SSN":"123-45-6789","DOB":"01\\/01\\/1970"},
	"autopopulate":"SSN",
	"pricequote":false,
	"product":
	[
		{"SearchCode":"EM","parameters":
		{"companyname":"Beer Buds","state":"TX","telephone":"867-5309","positionheld":"Sr. Vice President","salary":"400K","employmentdates":"10\\/05-12\\/16","employmentcity":"Austin","reasonforleaving":"Boss tried to kill me"}},
		{"SearchCode":"SC","aliases":["Dough,John,A","Doe,Jon,"]}
	],
	"postbackurl":"https://somedomain.com/somepath"
}
	
\`\`\`

#### [Example Response](#collapseAlias)

\`\`\`
								
								{
  "status": 0,
  "description": "Orders returned.",
  "payload": {
    "applicantinfo": {
      "firstname": "John",
      "lastname": "Doe",
      "SSN": "123-45-6789",
      "DOB": "01/01/1970"
    },
    "autopopulate": "SSN",
    "pricequote": false,
    "product": [
      {
        "SearchCode": "EM",
        "parameters": {
          "companyname": "Beer Buds",
          "state": "TX",
          "telephone": "867-5309",
          "positionheld": "Sr. Vice President",
          "salary": "400K",
          "employmentdates": "10/05-12/16",
          "employmentcity": "Austin",
          "reasonforleaving": "Boss tried to kill me"
        },
        "pid": "7",
        "AreaType": "N",
        "productID": "7",
        "Search": "",
        "price": 8,
        "amount": "8.00",
        "additional": "0.00",
        "CanReschedule": false,
        "searchID": 8222321
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "44",
        "location": {
          "state": "Texas",
          "stateID": "44",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "CanReschedule": false,
        "searchID": 8222322
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "34",
        "location": {
          "state": "North Dakota",
          "stateID": "34",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "CanReschedule": false,
        "searchID": 8222325
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "32",
        "location": {
          "state": "New York",
          "stateID": "32",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "CanReschedule": false,
        "searchID": 8222328
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "44",
        "location": {
          "state": "Texas",
          "stateID": "44",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "searchAlias": "Dough,John,A",
        "searchID": 8222323
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "44",
        "location": {
          "state": "Texas",
          "stateID": "44",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "searchAlias": "Doe,Jon,",
        "searchID": 8222324
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "34",
        "location": {
          "state": "North Dakota",
          "stateID": "34",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "searchAlias": "Dough,John,A",
        "searchID": 8222326
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "34",
        "location": {
          "state": "North Dakota",
          "stateID": "34",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "searchAlias": "Doe,Jon,",
        "searchID": 8222327
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "32",
        "location": {
          "state": "New York",
          "stateID": "32",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "searchAlias": "Dough,John,A",
        "searchID": 8222329
      },
      {
        "SearchCode": "SC",
        "pid": "2",
        "stateID": "32",
        "location": {
          "state": "New York",
          "stateID": "32",
          "county": "",
          "countyID": 0
        },
        "productID": "2",
        "price": 24,
        "amount": "14.00",
        "additional": "10.00",
        "searchAlias": "Doe,Jon,",
        "searchID": 8222330
      }
    ],
    "postbackurl": "https://somedomain.com/somepath",
    "userid": "10",
    "checkoutStatus": {
      "status": 1
    },
    "price": 80,
    "clientID": "2",
    "paymentStatus": "invoicePay",
    "orderID": 1568990
  }
}

							
\`\`\`

##### Example Postback

#### [Example Postback](#collapse3)

\`\`\`
								
{
	"ReportID":"1510636",
	"RecordsFound":"0",
	"Searches":[{"SearchID":"7921958","SearchName":"SSN Trace\\/Address History","Notes":"","RecordsFound":"0"},
	{"SearchID":"7921959","SearchName":"Death Records Index","Notes":"","RecordsFound":"0"},
	{"SearchID":"7921960","SearchName":"Nationwide Criminal\\/Sex Offender\\/OFAC\\/OIG\\/GSA\\/SAM","Notes":"","RecordsFound":"0"}]
	"PDF":"JVBERi0xLjQKJeLjz9MKMyAwIG9iago8P..."
}
								
							
\`\`\`

##### Example Get Request

#### [Example Order Get Request](#collapse4)

/api2/index.php/orders/1560179

\`\`\`
								
{
  "status": 0,
  "description": "Search list returned.",
  "payload": {
    "Searches": [
      {
        "FirstName": "Mark",
        "LastName": "Colbath",
        "SearchID": "8177311",
        "SearchName": "SSN Trace/Address History",
        "SearchStatus": "Closed",
        "Notes": "",
        "RecordsFound": "1"
      }
    ],
    "OrderID": "1560179",
    "OrderStatus": "closed"
  }
}
								
							
\`\`\``,
  },
  {
    slug: "packages",
    name: "Packages",
    shortDescription: "List all packages available to client account.",
    endpoints: [
      { verb: "GET", path: "/packages/{id}" },
    ],
    markdown: `## Rapid Hire Solutions API v2

### GET /packages/ {id}

#### List search packages

List all packages available to client account.

##### Example Request

\`\`\`
	 curl -X GET --user name:password https://clients.rapidhiresolutions.com/api2/packages
\`\`\`

#### Example Response

\`\`\`
				 
{
	"status": 0,
	"description": "Package list returned.",
	"payload":
	[
		{
			"PackageName": "Test Package",
			"PackageID": "2483",
			"Cost": "1.00",
			"PackageBuilderGroup": "408",
			"Searches":
			[
				{
					"SearchID": "71",
					"SearchName": "Bankruptcies, Liens, Judgments ",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "1",
					"SearchArea": "Nationwide",
					"AreaType": "N"
				},
				{
					"SearchID": "6",
					"SearchName": "County Criminal",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "County Level",
					"AreaType": "C"
				},
				{
					"SearchID": "85",
					"SearchName": "Nationwide Criminal\\/Sex Offender Search",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "Nationwide",
					"AreaType": "N"
				},
				{
					"SearchID": "36",
					"SearchName": "SSN Trace\\/Address History",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "Non Location",
					"AreaType": "N"
				}
			]
		},
		{
			"PackageName": "Test Package: 2 Counties",
			"PackageID": "2485",
			"Cost": "2.00",
			"PackageBuilderGroup": "408",
			"Searches":
			[
				{
					"SearchID": "71",
					"SearchName": "Bankruptcies, Liens, Judgments ",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "1",
					"SearchArea": "Nationwide",
					"AreaType": "N"
				},
				{
					"SearchID": "6",
					"SearchName": "County Criminal",
					"Quantity": "2",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "County Level",
					"AreaType": "C"
				},
				{
					"SearchID": "85",
					"SearchName": "Nationwide Criminal\\/Sex Offender Search",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "Nationwide",
					"AreaType": "N"
				},
				{
					"SearchID": "36",
					"SearchName": "SSN Trace\\/Address History",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "Non Location",
					"AreaType": "N"
				}
			]
		},
		{
			"PackageName": "Test Package: Unlimited Counties",
			"PackageID": "2488",
			"Cost": "5.00",
			"PackageBuilderGroup": "408",
			"Searches":
			[
				{
					"SearchID": "71",
					"SearchName": "Bankruptcies, Liens, Judgments ",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "1",
					"SearchArea": "Nationwide",
					"AreaType": "N"
				},
				{
					"SearchID": "6",
					"SearchName": "County Criminal",
					"Quantity": "0",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "County Level",
					"AreaType": "C"
				},
				{
					"SearchID": "85",
					"SearchName": "Nationwide Criminal\\/Sex Offender Search",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "Nationwide",
					"AreaType": "N"
				},
				{
					"SearchID": "36",
					"SearchName": "SSN Trace\\/Address History",
					"Quantity": "1",
					"SSNRequired": "1",
					"DOBRequired": "1",
					"AddressRequired": "0",
					"SearchArea": "Non Location",
					"AreaType": "N"
				}
			]
		}
	]
}
\`\`\``,
  },
  {
    slug: "products",
    name: "Products",
    shortDescription: "List all search products available to order for client account.",
    endpoints: [
      { verb: "GET", path: "/products" },
    ],
    markdown: `## Rapid Hire Solutions API v2

### 
GET
    /products

#### List all search products available to order for client account.

##### Example Request

\`\`\`

	curl -X GET --user name:password https://clients.rapidhiresolutions.com/api2/products
	
	
\`\`\`

List all searches available to order for client account.

#### 
Example Response

\`\`\`

{
  "status": 0,
  "description": "Search list returned.",
  "payload": [
    {
      "ID": "101",
      "SearchName": "Adverse Action Letter",
      "SearchCategory": "Adverse Action Letter",
      "SSNRequired": "0",
      "DOBRequired": "0",
      "AddressRequired": "0",
      "SearchCode": "AAL"
    },
    {
      "ID": "99",
      "SearchName": "CDLIS",
      "SearchCategory": "CDLIS",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "CDLIS"
    },
    {
      "ID": "71",
      "SearchName": "Bankruptcies, Liens, Judgments ",
      "SearchCategory": "Civil",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "BLJ"
    },
    {
      "ID": "9",
      "SearchName": "County Civil",
      "SearchCategory": "Civil",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "CCIV"
    },
    {
      "ID": "124",
      "SearchName": "FFIEC",
      "SearchCategory": "Civil",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "FFEIC"
    },
    {
      "ID": "69",
      "SearchName": "Canadian Criminal Search",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "0",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "CANCRIM"
    },
    {
      "ID": "6",
      "SearchName": "County Criminal",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "CC"
    },
    {
      "ID": "111",
      "SearchName": "County Criminal 10 Years",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "CC10"
    },
    {
      "ID": "76",
      "SearchName": "Excluded Parties List System Search",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "EPLSS"
    },
    {
      "ID": "18",
      "SearchName": "Facis I",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "FAC1"
    },
    {
      "ID": "19",
      "SearchName": "Facis II",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "FAC2"
    },
    {
      "ID": "20",
      "SearchName": "Facis III",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "FAC3"
    },
    {
      "ID": "21",
      "SearchName": "General Service Administration (GSA)",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "GSA"
    },
    {
      "ID": "153",
      "SearchName": "Global Watch List",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "GWL"
    },
    {
      "ID": "45",
      "SearchName": "International Criminal Search",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "0",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "INTCRIME"
    },
    {
      "ID": "1",
      "SearchName": "Nationwide Criminal Search",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "NC"
    },
    {
      "ID": "85",
      "SearchName": "Nationwide Criminal\\/Sex Offender Search",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "NCSOS"
    },
    {
      "ID": "113",
      "SearchName": "Nationwide Criminal\\/Sex Offender Search 10 Years",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "NCSO10"
    },
    {
      "ID": "24",
      "SearchName": "Nationwide Federal Criminal Search",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "NFC"
    },
    {
      "ID": "31",
      "SearchName": "Nationwide Sex Offender",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "NSO"
    },
    {
      "ID": "32",
      "SearchName": "Nationwide Wants and Warrants",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "NWW"
    },
    {
      "ID": "33",
      "SearchName": "OFAC",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "OFAC"
    },
    {
      "ID": "122",
      "SearchName": "SAM (System For Award Management)",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "SAM"
    },
    {
      "ID": "81",
      "SearchName": "Specialty Designated Nationals (SDN)",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "SDN"
    },
    {
      "ID": "144",
      "SearchName": "State of Massachusetts iCori Search",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "MICORI"
    },
    {
      "ID": "2",
      "SearchName": "Statewide Criminal",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "SC"
    },
    {
      "ID": "151",
      "SearchName": "TX Dept. Public Safety",
      "SearchCategory": "Criminal Search",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "TXDPS"
    },
    {
      "ID": "91",
      "SearchName": "Canadian Driving History",
      "SearchCategory": "Driving History",
      "SSNRequired": "0",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "CDH"
    },
    {
      "ID": "11",
      "SearchName": "Driving History",
      "SearchCategory": "Driving History",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "MVR"
    },
    {
      "ID": "127",
      "SearchName": "FMCSA Verification",
      "SearchCategory": "Driving History",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "FMCSAV"
    },
    {
      "ID": "139",
      "SearchName": "TX CDL Driving History",
      "SearchCategory": "Driving History",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "TXCDL"
    },
    {
      "ID": "140",
      "SearchName": "WY CDL Driving History",
      "SearchCategory": "Driving History",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "WYCDL"
    },
    {
      "ID": "146",
      "SearchName": "5 Panel Hair",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "5PH"
    },
    {
      "ID": "147",
      "SearchName": "5 Panel Hair Exp. Opiates",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "5PHO"
    },
    {
      "ID": "148",
      "SearchName": "9 Panel Hair",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "9PH"
    },
    {
      "ID": "133",
      "SearchName": "Alcohol Screen",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "ALCSC"
    },
    {
      "ID": "94",
      "SearchName": "DOT Drug Screen ",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DDS"
    },
    {
      "ID": "164",
      "SearchName": "Drug Screen 10 Panel   Expanded Opiates   Oxycodone",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS10PEOO"
    },
    {
      "ID": "150",
      "SearchName": "Drug Screen 10 Panel- Oral",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS10PO"
    },
    {
      "ID": "74",
      "SearchName": "Drug Screening 10 Panel (Lab)",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS10P"
    },
    {
      "ID": "171",
      "SearchName": "Drug Screening 10 Panel Plus ALCH Blood Draw",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS10ALCH"
    },
    {
      "ID": "135",
      "SearchName": "Drug Screening 10 Panel W\\/Alcohol (Lab)",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS10PWA"
    },
    {
      "ID": "75",
      "SearchName": "Drug Screening 12 Panel (Lab)",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "0",
      "AddressRequired": "1",
      "SearchCode": "DS12P"
    },
    {
      "ID": "143",
      "SearchName": "Drug Screening 5 Panel - Oral",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS5PO"
    },
    {
      "ID": "15",
      "SearchName": "Drug Screening 5 Panel (Lab)",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DSP5"
    },
    {
      "ID": "174",
      "SearchName": "Drug Screening 5 Panel with Nicotine",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS5N"
    },
    {
      "ID": "104",
      "SearchName": "Drug Screening 9 Panel (Rapid)",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DS9P"
    },
    {
      "ID": "149",
      "SearchName": "Drug Screening Super 12 Panel W\\/Alcohol",
      "SearchCategory": "Drug Test",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "DSS12"
    },
    {
      "ID": "17",
      "SearchName": "Education Verification",
      "SearchCategory": "Education Verification",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "EV"
    },
    {
      "ID": "152",
      "SearchName": "International Education Verification",
      "SearchCategory": "Education Verification",
      "SSNRequired": "0",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "IEV"
    },
    {
      "ID": "95",
      "SearchName": "DOT Employment Verification",
      "SearchCategory": "Employment Verification",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "DOTEV"
    },
    {
      "ID": "7",
      "SearchName": "Employment Verification",
      "SearchCategory": "Employment Verification",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "EM"
    },
    {
      "ID": "159",
      "SearchName": "Death Records Index",
      "SearchCategory": "Generic, No Special Forms Required",
      "SSNRequired": "0",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "DRI"
    },
    {
      "ID": "128",
      "SearchName": "DOT Physical",
      "SearchCategory": "Generic, No Special Forms Required",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "DOTP"
    },
    {
      "ID": "3",
      "SearchName": "I-9 Verifications (E-Verify)",
      "SearchCategory": "I-9 Verification",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "I9"
    },
    {
      "ID": "67",
      "SearchName": "Office of Inspector General (OIG)",
      "SearchCategory": "OIG",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "OIG"
    },
    {
      "ID": "34",
      "SearchName": "Professional License Verification",
      "SearchCategory": "Professional License Verification",
      "SSNRequired": "0",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "PLV"
    },
    {
      "ID": "160",
      "SearchName": "Company Reference Verification",
      "SearchCategory": "Reference Verification",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "CRV"
    },
    {
      "ID": "167",
      "SearchName": "International Reference Check",
      "SearchCategory": "Reference Verification",
      "SSNRequired": "0",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "IRC"
    },
    {
      "ID": "129",
      "SearchName": "Professional Reference Verification",
      "SearchCategory": "Reference Verification",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "1",
      "SearchCode": "PRV"
    },
    {
      "ID": "36",
      "SearchName": "SSN Trace\\/Address History",
      "SearchCategory": "SSN Trace",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "SSN"
    },
    {
      "ID": "39",
      "SearchName": "Workers Compensation",
      "SearchCategory": "Workers Compensation",
      "SSNRequired": "1",
      "DOBRequired": "1",
      "AddressRequired": "0",
      "SearchCode": "WORKCOMP"
    }
  ]
}
								
							
\`\`\`
`,
  },
  {
    slug: "researchers",
    name: "Researchers",
    shortDescription: "The researchers resource allows you to get a list of pending searches for a researcher and update reports for a given search ID.",
    endpoints: [
      { verb: "GET", path: "/researchers" },
      { verb: "POST", path: "/researchers" },
    ],
    markdown: `### GET /researchers

#### Get a list of pending searches for this researcher.

Get a list of pending searches for this researcher.

#### Example Response

\`\`\`json
{
  "status": 0,
  "description": "Search list returned.",
  "payload": [
    {
      "FirstName": "Ezequiel",
      "MiddleName": "E",
      "LastName": "Espinosa",
      "DOB": "07/13/1978",
      "SearchID": "4967172",
      "SearchName": "County Criminal",
      "SearchStatus": "Pending",
      "County": "Harris",
      "State": "Texas"
    },
    {
      "FirstName": "Brittney",
      "MiddleName": "K",
      "LastName": "Peartree",
      "DOB": "05/12/1983",
      "SearchID": "4967504",
      "SearchName": "County Criminal",
      "SearchStatus": "Pending",
      "County": "Harris",
      "State": "Texas"
    }
  ]
}
\`\`\`

### POST /researchers

#### Update report for a given search.

Update report for a given search ID.

##### Example Request

\`\`\`json
{
  "searchID": 4967172,
  "adverseRecordsFound": 1,
  "report": "<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t<p>This is one bad dude!</p>\\n\\t"
}
\`\`\`

#### Example Response

\`\`\`json
{
  "status": 0,
  "description": "Report post",
  "payload": "Report #4967172 updated."
}
\`\`\``,
  },
];

/**
 * Convenience helper — total endpoint count across all resources.
 * Used by the /integrations hero stat band and by the PDF cover.
 */
export const API_ENDPOINT_TOTAL: number = API_RESOURCES.reduce(
  (n, r) => n + r.endpoints.length,
  0,
);
