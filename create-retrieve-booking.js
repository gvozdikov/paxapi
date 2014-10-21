var Client = require('node-rest-client').Client;
var util = require('util');

client = new Client();

function generateBookingNumber() {
  var text = "BNBLX";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

argsPost = {
  data:
    "<?xml version='1.0' encoding='utf-8'?><mes:Booking xmlns:mes='http://api.paxport.se/openpax/messages' xmlns:typ='http://api.paxport.se/openpax/types'><typ:BookingNumber>" + generateBookingNumber() + "</typ:BookingNumber><typ:CarrierCode>BLX</typ:CarrierCode><typ:TourOperatorName></typ:TourOperatorName><typ:TourOperatorCode>FRI</typ:TourOperatorCode><typ:FlightList><!--1 or more repetitions:--><typ:Flight><typ:FlightId><typ:CarrierCode>BLX</typ:CarrierCode><typ:FlightNumber>BLX111</typ:FlightNumber><typ:DepartureDateTime>2014-12-01T07:45:00Z</typ:DepartureDateTime></typ:FlightId><typ:DepartureAirport><!--You may enter the following 4 items in any order--><typ:Code>ARN</typ:Code></typ:DepartureAirport><typ:ArrivalTime>2014-12-01T10:45:00Z</typ:ArrivalTime><typ:ArrivalAirport><!--You may enter the following 4 items in any order--><typ:Code>BKK</typ:Code></typ:ArrivalAirport><typ:CabinClass>C</typ:CabinClass></typ:Flight></typ:FlightList><typ:PassengerList><typ:Passenger><typ:FirstName>Alex</typ:FirstName><typ:LastName>Rogachev</typ:LastName><typ:Category>adult</typ:Category><typ:Age>30</typ:Age><typ:Gender>male</typ:Gender><typ:ApisInfo><!--Optional:--><typ:TravelDocumentList><!--Zero or more repetitions:--><typ:TravelDocument><!--Optional:--><typ:TravelDocumentType>P</typ:TravelDocumentType><!--Optional:--><typ:TravelDocumentNumber>36247</typ:TravelDocumentNumber><!--Optional:--><typ:TravelDocumentIssuingCountry>RUS</typ:TravelDocumentIssuingCountry><!--Optional:--><typ:PassengerNationality>RUS</typ:PassengerNationality><!--Optional:--><typ:DateOfBirth>1984-12-14</typ:DateOfBirth><!--Optional:--><typ:TravelDocumentExpiryDate>2015-12-14</typ:TravelDocumentExpiryDate><!--Optional:--><typ:TravelDocumentFirstGivenName>Alex</typ:TravelDocumentFirstGivenName><!--Optional:--><typ:TravelDocumentSecondGivenName>HGH</typ:TravelDocumentSecondGivenName><!--Optional:--><typ:TravelDocumentLastName>Rogachev</typ:TravelDocumentLastName><!--Optional:--><typ:GenderCode>M</typ:GenderCode></typ:TravelDocument></typ:TravelDocumentList><!--Optional:--><typ:ResidenceAddress><!--Optional:--><typ:CountryCode>RUS</typ:CountryCode><!--Optional:--><typ:State>YU</typ:State><!--Optional:--><typ:City>IZHEVSK</typ:City><!--Optional:--><typ:Street>LENINA</typ:Street><!--Optional:--><typ:PostalCode>1234678</typ:PostalCode></typ:ResidenceAddress><!--Optional:--><typ:DestinationAddress><!--Optional:--><typ:CountryCode>RUS</typ:CountryCode><!--Optional:--><typ:State>UIU</typ:State><!--Optional:--><typ:City>IZHEVSK</typ:City><!--Optional:--><typ:Street>LENINA</typ:Street><!--Optional:--><typ:PostalCode>2764723</typ:PostalCode></typ:DestinationAddress><!--Optional:--><typ:RedressNumber>3827648</typ:RedressNumber><!--Optional:--><typ:KnownTravelerNumber>28748</typ:KnownTravelerNumber><!--Optional:<typ:TopUniqueId></typ:TopUniqueId>--></typ:ApisInfo></typ:Passenger></typ:PassengerList></mes:Booking>",
  headers: { "Content-Type": "application/xml", "Authorization": "Basic ZnJpdGlkc3Jlc29yOmFwaXRlc3Q=" }
};

console.log("\n\n1. Wanna create a booking?");
console.log("Posting booking XML ...\n\n");

client.post("https://staging.paxport.se/openpax2-api/rest/bookings", argsPost, function(data, response) {
  if (response.statusCode === 401) {
    console.log("401 - Authentication credentials are required");
    return;
  } else if (response.statusCode != 201) {
    console.log("Something went wrong... :-(");
    return;
  }

  console.log(data);
  detailUrl = "https://staging.paxport.se/openpax2-api/rest/bookings/" + data["ns2:BookingReference"].Id + "/detail";

  console.log("\n\n2. Wonder was it accepted?");
  console.log("Getting booking XML ...\n\n");

  argsGet = {
    headers: { "Content-Type": "application/xml", "Authorization": "Basic ZnJpdGlkc3Jlc29yOmFwaXRlc3Q=" }
  };
  client.get(detailUrl, argsGet, function(data, response) {
    if (response.statusCode === 401) {
      console.log("401 - Authentication credentials are required");
      return;
    } else if (response.statusCode != 200) {
      console.log("Something went wrong... :-(");
      return;
    }

    console.log(util.inspect(data, { showHidden: true, depth: null }));
  });
});
