var fs=require("fs");
var util=require("util");

var IPsList = [];

secureRegex = /\n((([01][0-9][0-9]|2[0-4][0-9]|25[0-5]|[0-9][0-9]|[0-9])\.([01][0-9][0-9]|2[0-4][0-9]|25[0-5]|[0-9][0-9]|[0-9])\.([01][0-9][0-9]|2[0-4][0-9]|25[0-5]|[0-9][0-9]|[0-9]))\.([01][0-9][0-9]|2[0-4][0-9]|25[0-5]|[0-9][0-9]|[0-9]))/ig;
lightRegex = /\n(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\.[0-9]{1,3})/ig;
main();
function main() {
    var ips = [];
    var log = fs.readFileSync("access.log", 'utf8');
    var IPs = log.match(secureRegex);
    console.log("Total IPs found:" + IPs.length);
    
    for (i = 0; i < IPs.length; i++)
    {
        var isPresent = false;
        for (j = 0; j < ips.length; j++)
        {
            if (ips[j] == IPs[i]) {
                var isPresent = true;
            }
        }

        if (!isPresent) {
            ips.push(IPs[i]);
        }
    }

    var subnets = {};
    for(i=0; i<ips.length; i++) {
        var ip = ips[i].substr(1, ips[i].length);
        var mask = ip.split('.',3).join('.')

        if (!subnets[mask]) {
            subnets[mask] = {}
            subnets[mask].mask = mask;
            subnets[mask].ips = [];
            subnets[mask].ips.push(ips[i]);
        }
        else {
            subnets[mask].ips.push(ips[i]);
        }
    }

    console.log("Subnets total: " + Object.keys(subnets).length + " , which has " + ips.length + " Unique IPs");
    for (var property in subnets) {
        if (subnets.hasOwnProperty(property)) {
            console.log("Mask: " + subnets[property].mask);
            for (j = 0; j < subnets[property].ips.length; j++) {
                console.log(subnets[property].ips[j]);
            }
            console.log("\n");
        }
    }
    console.log("IPs:" + ips.length, "; subents: " + Object.keys(subnets).length);
}