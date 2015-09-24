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

        var updateDebts = function() {
            for (var i = 0; i < n; i++)
                guys[i].debt(  ((total/n) - parseFloat(guys[i].paid())));
        };

        var checkDebts = function() {
            for (var i = 0; i < n; i++) {
                var guy = guys[i];
                if (guy.debt() < 0)
                    return guy;
            }
	    return null;
        };

        updateDebts();

        for (var i = 0; i < n; i++){
            var guy = guys[i];
            while (guy.debt() > 0){
                var debtee = checkDebts();
                if ( debtee ) {
                    if ( guy !== debtee ) {
                        var amount = 0;
                        if ( guy.debt() <= (-1) * debtee.debt() ) 
                            amount = guy.debt();
                        else
                            amount = (-1) * debtee.debt();

                        self.results.push(guy.name + " يعطي " + amount.toFixed(2) + " لـ " + debtee.name );
                        guy.debt( guy.debt() - amount);
                        debtee.debt( debtee.debt() + amount);
                    }
                } else {
			break;
		}
            }
        }
    };

}

ko.applyBindings(new TripBalanceViewModel());
