App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
        
  init: function() {
     return App.initWeb3();
  },

    initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
      return App.initContract();
    },
      initContract: function() {
      $.getJSON("MyLandContract.json", function(house) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.MyLandContract = TruffleContract(house);
        // Connect provider to interact with contract
        App.contracts.MyLandContract.setProvider(App.web3Provider);

        //App.listenForEvents();

        return App.render();
        });
      },  
      render: function() {
        var houseInstance;
        web3.eth.getCoinbase(function(err, account) {

          if (err === null) {
            //  console.log("account : " + account);
            App.account = account;
            $("#accountAddress").html("Your Account: " + account);
            console.log("account : " + App.account);
            var accounts = web3.eth.getAccounts(0);
            console.log(web3.eth.accounts);
          }
          });
          // Load Contract Data
          App.contracts.MyLandContract.deployed().then(function(instance) {
            houseInstance = instance;
            return houseInstance.getNoOfLands(App.account);
          }).then(function(result) {
            console.log("Total land: " + result)

          }).catch(function(error) {
            console.warn(error);
          });
          },
          addProperty: function() {
            var etherAddress = $('#etherAddress').val();
            var propLocation = $('#location').val();
            var propCost = $('#cost').val();
            App.contracts.MyLandContract.deployed().then(function(instance) {
              return instance.addLand(etherAddress, propLocation, propCost);
            }).then(function(result) {
              console.log(result)
            }).catch(function(err) {
              console.error(err);
            }); 
            App.contracts.MyLandContract.deployed().then(function(instance) {
              houseInstance = instance;
              return houseInstance.getNoOfLands(App.account);
            }).then(function(result) {
              console.log("Total land: " + result)
  
            }).catch(function(error) {
              console.warn(error);
            });  
          },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});