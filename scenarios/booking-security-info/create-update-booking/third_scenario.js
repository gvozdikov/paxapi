var Client = require('node-rest-client').Client;
var util = require('util');
var fs = require('fs');
var pd = require('pretty-data').pd;
var colors = require('colors');
var js2xmlparser = require("js2xmlparser");

var apikey = require('./../../../util/_apikey');
var bonogen = require('./../../../util/_bonogen');
var generatePerson = require('./../../../util/_generatePerson');
var b = require('./../../../api/booking')(
    {
        client: new Client(),
        verbose: true,
        apikey: apikey.getSync(),
        baseUrl: 'http://trigada.paxport.se:8080/openpax2-api/rest'
    }
);

/*
 Scenario: create and update a booking
 Given: booking is created
 When: update booking
 Then: booking is updated
 */

console.log('Wanna create a booking?'.blue);
var raw = fs.readFileSync(__dirname + '/booking_with_apis.xml', { encoding: 'UTF8' });
var raw_update = fs.readFileSync(__dirname + '/booking_with_apis.xml', { encoding: 'UTF8' });
//var raw = js2xmlparser("mes:Booking", fs.readFileSync(__dirname + '/booking.json', { encoding: 'UTF8' }));
var bono = bonogen.bonogen(7);
var person = generatePerson.get();
var xml = pd.xmlmin(raw).replace('${bono}', bono).replace(/\$\{passengerName\}/g, person.firstName).replace(/\$\{passengerSurname\}/g, person.lastName).replace('${genderCode}', person.sex.charAt(0).toUpperCase())
    .replace(/\$\{sex\}/g, person.sex).replace(/\$\{street\}/g, person.street).replace(/\$\{city\}/g, person.city).replace(/\$\{state\}/g, person['state']).replace(/\$\{zipCode\}/g, person.zipCode);

person = generatePerson.get();
var xml_update = pd.xmlmin(raw).replace('${bono}', bono).replace(/\$\{passengerName\}/g, person.firstName).replace(/\$\{passengerSurname\}/g, person.lastName).replace('${genderCode}', person.sex.charAt(0).toUpperCase())
    .replace(/\$\{sex\}/g, person.sex).replace(/\$\{street\}/g, person.street).replace(/\$\{city\}/g, person.city).replace(/\$\{state\}/g, person['state']).replace(/\$\{zipCode\}/g, person.zipCode);
b.post(xml)
    .then(
    function(data) {
        console.log('Created!'.green);
        var boid = {
            id: data,
            number: bono
        };
        console.log(boid);

        console.log("Let's make sure it's there!!".blue);
        b.get(data).then(
            function(data) {
                console.log("It's there!".green);
                console.log(util.inspect(data, { showHidden: true, depth: null }));
                b.put(boid.id, xml_update)
                    .then(
                    function(data) {
                        console.log('Updated!'.green);
                        b.get(boid.id).then(
                            function(data) {
                                console.log("Updated booking's there!".green);
                                console.log(util.inspect(data, { showHidden: true, depth: null }));
                            })
                    })
            },
            console.log
        );
    })
    .fail(function(err) {
        console.log(err.red);
    })
;
