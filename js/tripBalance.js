// Class to represent a row in the seat reservations grid
function Guy(name) {
    var self = this;

    self.name = name;
    self.paid = ko.observable(0.0);
    self.debt = ko.observable(0.0);
}

// Overall viewmodel
function TripBalanceViewModel() {
    var self = this;

    self.guys = ko.observableArray([
        new Guy("Abdullah"),
        new Guy("Nasser"),
        new Guy("Saad")
    ]);

    self.newGuyName = "";
    self.results = ko.observableArray("");

    // Methods
    self.addGuy = function() {
        self.guys.push(new Guy(self.newGuyName));
        self.newGuyName = "";
    };


    self.total = ko.computed( function() {
        var t = 0;
        for (var i = 0; i < self.guys().length; i++)
            t += parseFloat(self.guys()[i].paid());
        return t;
    }, this);

    self.calculate = function() {
        self.results([]);
        var n = self.guys().length;
        var guys = self.guys();
        var total = parseFloat(self.total());

        var setDebts = function() {
            // Setting the debts
            for (var i = 0; i < n; i++)
                guys[i].debt( -1 * ((total/n) - parseFloat(guys[i].paid())) );
        };

        var debtees = function() {
            var debteesList = [];
            for (var i = 0; i < n; i++)
                if ( guys[i].debt() > 0 ) debteesList.push(guys[i]); 

            return debteesList;
        };


        // Looping thru the guys
        for (var i = 0; i < n; i++) {
            setDebts();
            var debteesList = debtees();

            var guy = guys[i];
            if ( guy.debt() < 0 ) {
                for (var j = 0; j < debteesList.length; j++){
                    self.results.push( guy.name + ' pays £' +
                                     ( -1 * (guy.debt().toFixed(2) / debteesList.length)) +
                                     " to " + debteesList[j].name );
                }
                guy.debt(0.0);
            }
        }
    };

}

ko.applyBindings(new TripBalanceViewModel());
