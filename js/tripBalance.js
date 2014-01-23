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
        for (var i =0; i < self.guys().length; i++)
            t += parseInt(self.guys()[i].paid());
        return t;
    }, this);

    self.calculate = function() {
        var n = self.guys().length;
        var total = parseInt(self.total());

        // Setting the debts
        for (var i = 0; i < n; i++)
            self.guys()[i].debt( (total/n) - parseInt(self.guys()[i].paid()) );

        for (var i = 0; i < n; i++) {
            var guy = self.guys()[i];

            if (guy.debt() > 0){
                for (var j=0; j<n; j++) {
                    var currentGuy = self.guys()[j];
                    // If it's not the guy him self
                    if (guy !== currentGuy) {
                        if (currentGuy.debt() < 0)
                            if (guy.debt() > currentGuy.debt()) {
                                // console.log(guy.name + " owns " + currentGuy.name + " " + ( guy.debt().toFixed(2) ) );
                                self.results.push(guy.name + " owns " + currentGuy.name + " " + ( guy.debt().toFixed(2) ));
                                guy.debt(0.0);
                            }
                    }
                }
            }
        }
    };

    self.resetResults = function() {
        // for (var i=0; i<self.results().length; i++)
        //     self.results().pop(); 
        self.results([]);
        console.log(self.results());
    };
}

ko.applyBindings(new TripBalanceViewModel());