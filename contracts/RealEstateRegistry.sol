pragma solidity ^0.4.6;
/// Minimal version of solc compiler must be specified

/// @title Real Estate Registry Contract
contract RealEstateRegistry {
    
    /*
	* Events
	*/
	event Purchase(uint256 id, uint256 price);
	
	/*
     * Modifiers
     */
    
    modifier onlyEscrow() {
        if (!escrows[msg.sender]) throw;
        _;
    }
    
    
    /*
     * Structures
     */
     
    enum Status {
        Owned,
        Sale,
        WaitConfirmation
    } 
     
    // Структура, которой будем описывать каждый объект недвижимости
    struct Estate {
        uint256 id;
        string name;
        uint256 price;
        Status status;
        address owner;
        address potentialOwner;
    }
    
    /*
     * Storage
     */
     
    // ключ - id объекта
    // значение - сам объект
    mapping (uint256 => Estate) estates;
     
    // Список авторизованных эскроу, которые могут валидировать сделки
    mapping (address => bool) escrows;
    
    uint256 lastEstateId = 0;

    /// @dev Constructor
	function RealEstateRegistry(string estate_name1, string estate_name2, string estate_name3,
                              address owner1, address owner2, address owner3, address inspector) {
	    estates[1] = Estate({
	        id: 1,
	        name: estate_name1,
	        price: 10 ether,
	        status: Status.Owned,
	        owner: owner1,
	        potentialOwner: 0
	    });
	    
	    estates[2] = Estate({
	        id: 2,
	        name: estate_name2,
	        price: 18 ether,
	        status: Status.Sale,
	        owner: owner2,
	        potentialOwner: 0
	    });
	    
	    estates[3] = Estate({
	        id: 3,
	        name: estate_name3,
	        price: 12 ether,
	        status: Status.WaitConfirmation,
	        owner: owner3,
	        potentialOwner: owner1
	    });
	    
	    escrows[inspector] = true;
	    
	    lastEstateId = 3;
  	}
  	
  	function addEstate(string name, uint256 price) {
  	    lastEstateId = lastEstateId + 1;
  	    estates[lastEstateId] = Estate({
	        id: lastEstateId,
	        name: name,
	        price: price,
	        status: Status.Sale,
	        owner: msg.sender,
	        potentialOwner: 0
	    });
  	}
  	
  	function sell(uint256 estateId, uint256 price) {
  	    if (estates[estateId].owner != msg.sender) throw;
  	    if (estates[estateId].status != Status.Owned) throw;
  	    estates[estateId].price = price;
  	     estates[estateId].status = Status.Sale;
  	}
  	
  	function buy(uint256 estateId) payable {
  	    if (estates[estateId].status != Status.Sale) throw;
  	    estates[estateId].potentialOwner = msg.sender;
  	    estates[estateId].status = Status.WaitConfirmation;
  	}
  	
  	function confirm(uint256 estateId) onlyEscrow {
  	    if (estates[estateId].status != Status.WaitConfirmation) throw;
  	    estates[estateId].owner = estates[estateId].potentialOwner;
  	    estates[estateId].potentialOwner = 0;
  	    estates[estateId].status = Status.Owned;
  	    Purchase(estateId, estates[estateId].price);
  	}
  	
  	function getEstate(uint256 estateId) constant returns(uint256, string, uint256, Status, address, address) {
  		Estate estate = estates[estateId];
  		return (estate.id, estate.name, estate.price, estate.status, estate.owner, estate.potentialOwner);
  	}

}