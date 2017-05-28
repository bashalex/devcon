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
	function RealEstateRegistry() {
	    estates[1] = Estate({
	        id: 1,
	        name: 'Test1',
	        price: 1 finney,
	        status: Status.Owned,
	        owner: 0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a,
	        potentialOwner: 0
	    });
	    
	    estates[2] = Estate({
	        id: 2,
	        name: 'Test2',
	        price: 2 finney,
	        status: Status.Sale,
	        owner: 0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a,
	        potentialOwner: 0
	    });
	    
	    estates[3] = Estate({
	        id: 3,
	        name: 'Test3',
	        price: 3 finney,
	        status: Status.WaitConfirmation,
	        owner: 0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a,
	        potentialOwner: 0
	    });
	    
	    escrows[0xf1f42f995046e67b79dd5ebafd224ce964740da3] = true;
	    
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
  	
  	function buy(uint256 estateId) {
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