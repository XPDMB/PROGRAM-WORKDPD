// Authentic user database
    const USERS = {
      admin: '36335',
      dpd: '36335',
      stock: '36335'
    };
    
    let currentUser = '';
    let products = [];
    let history = [];
    let PERSONNEL = [];

    // --- i18n Translation Dictionary ---
    const i18n = {
      "à¸ à¸²à¸žà¸£à¸§à¸¡": "Overview",
      "à¸ªà¸•à¹‡à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸²": "Stock",
      "à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸šà¸´à¸-à¸£à¸±à¸š": "History",
      "à¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£": "Personnel",
      "à¸œà¸¹à¹‰à¸”à¸¹à¹à¸¥à¸£à¸°à¸šà¸š": "Administrator",
      "à¸­à¸­à¸à¸ˆà¸²à¸à¸£à¸°à¸šà¸š": "Logout",
      "à¸ à¸²à¸žà¸£à¸§à¸¡à¸ªà¸•à¹‡à¸­à¸à¸§à¸±à¸™à¸™à¸µà¹‰": "Stock Overview Today",
      "à¹à¸ªà¸”à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹€à¸Šà¸´à¸‡à¸ªà¸£à¸¸à¸›à¹à¸¥à¸°à¸à¸²à¸£à¹à¸ˆà¹‰à¸‡à¹€à¸•à¸·à¸­à¸™à¸‚à¸­à¸‡à¸ªà¸´à¸™à¸„à¹‰à¸²à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¹ƒà¸™à¸£à¸°à¸šà¸š": "Summary and alerts of remaining stock in the system",
      "à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸à¸¥à¹‰à¸«à¸¡à¸”à¸ªà¸•à¹‡à¸­à¸ (à¸•à¹ˆà¸³à¸à¸§à¹ˆà¸²à¸ˆà¸¸à¸”à¸ªà¸±à¹ˆà¸‡à¸‹à¸·à¹‰à¸­à¸‚à¸±à¹‰à¸™à¸•à¹ˆà¸³ / Min Stock)": "Low Stock Items (Below Min Stock)",
      "à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²": "Product Code",
      "à¸Šà¸·à¹ˆà¸­": "Name",
      "à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­": "Remaining",
      "à¸‚à¸±à¹‰à¸™à¸•à¹ˆà¸³": "Min",
      "à¸£à¸²à¸¢à¸à¸²à¸£à¸ªà¸•à¹‡à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸²": "Stock List",
      "à¸„à¹‰à¸™à¸«à¸² à¸ˆà¸±à¸”à¸à¸²à¸£ à¹à¸¥à¸°à¸¥à¸‡à¸—à¸°à¹€à¸šà¸µà¸¢à¸™à¸žà¸±à¸ªà¸”à¸¸à¹ƒà¸™à¸„à¸¥à¸±à¸‡à¸ªà¸´à¸™à¸„à¹‰à¸²": "Search, manage, and register items in warehouse",
      "à¹€à¸žà¸´à¹ˆà¸¡à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸«à¸¡à¹ˆ": "Add New Product",
      "à¸£à¸±à¸šà¸ªà¸´à¸™à¸„à¹‰à¸²à¹€à¸‚à¹‰à¸²": "Receive Stock",
      "à¹€à¸šà¸´à¸à¸ªà¸´à¸™à¸„à¹‰à¸²à¸­à¸­à¸": "Issue Stock",
      "à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸ªà¸•à¹‡à¸­à¸": "Stock Movement History",
      "à¹à¸ªà¸”à¸‡à¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸£à¸±à¸šà¹€à¸‚à¹‰à¸² à¹€à¸šà¸´à¸à¸ˆà¹ˆà¸²à¸¢ à¹à¸¥à¸°à¸à¸²à¸£à¸¥à¸‡à¸—à¸°à¹€à¸šà¸µà¸¢à¸™à¸ªà¸´à¸™à¸„à¹‰à¸²à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”à¹ƒà¸™à¸£à¸°à¸šà¸š": "History of receiving, issuing, and registration",
      "à¸›à¸£à¸°à¹€à¸ à¸—à¸à¸´à¸ˆà¸à¸£à¸£à¸¡:": "Activity Type:",
      "à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”": "All",
      "à¸£à¸±à¸š": "Receive",
      "à¹€à¸šà¸´à¸": "Issue",
      "à¹€à¸žà¸´à¹ˆà¸¡": "Add",
      "à¹à¸à¹‰à¹„à¸‚": "Edit",
      "à¸›à¸£à¸±à¸šà¸›à¸£à¸¸à¸‡": "Update",
      "à¸¥à¸š": "Delete",
      "à¸£à¸±à¸šà¹€à¸‚à¹‰à¸²": "Received",
      "à¹€à¸šà¸´à¸à¸­à¸­à¸": "Issued",
      "à¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸‚à¹‰à¸²à¸£à¸²à¸Šà¸à¸²à¸£": "Personnel List",
      "à¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸‚à¹‰à¸²à¸£à¸²à¸Šà¸à¸²à¸£à¹à¸¥à¸°à¹€à¸ˆà¹‰à¸²à¸«à¸™à¹‰à¸²à¸—à¸µà¹ˆ à¹€à¸£à¸µà¸¢à¸‡à¸¥à¸³à¸”à¸±à¸šà¸•à¸²à¸¡à¸Šà¸±à¹‰à¸™à¸¢à¸¨à¹à¸¥à¸°à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡à¹ƒà¸™à¸à¸²à¸£à¹€à¸šà¸´à¸à¸ˆà¹ˆà¸²à¸¢à¸žà¸±à¸ªà¸”à¸¸": "List of officials and staff ordered by rank and position",
      "à¸„à¹‰à¸™à¸«à¸²à¸”à¹‰à¸§à¸¢à¸Šà¸·à¹ˆà¸­ à¸«à¸£à¸·à¸­ à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡...": "Search by name or position...",
      "à¸„à¹‰à¸™à¸«à¸²à¸”à¹‰à¸§à¸¢à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸² à¸«à¸£à¸·à¸­ à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²...": "Search by code or name...",
      "à¹€à¸žà¸´à¹ˆà¸¡à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¹ƒà¸«à¸¡à¹ˆ": "Add New Personnel",
      "à¸¢à¸¨-à¸Šà¸·à¹ˆà¸­-à¸ªà¸à¸¸à¸¥": "Rank-Name-Surname",
      "à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡": "Position",
      "à¹€à¸šà¸­à¸£à¹Œà¸•à¸´à¸”à¸•à¹ˆà¸­": "Phone Number",
      "à¸ˆà¸±à¸”à¸à¸²à¸£": "Action",
      "à¸¥à¸‡à¸—à¸°à¹€à¸šà¸µà¸¢à¸™à¹€à¸žà¸´à¹ˆà¸¡à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸«à¸¡à¹ˆ": "Register New Product",
      "à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆà¸ªà¸´à¸™à¸„à¹‰à¸²": "Category",
      "à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸ªà¸³à¸™à¸±à¸à¸‡à¸²à¸™": "Office Supplies",
      "à¸§à¸±à¸ªà¸”à¸¸à¸ªà¸´à¹‰à¸™à¹€à¸›à¸¥à¸·à¸­à¸‡": "Consumables",
      "à¸­à¸°à¹„à¸«à¸¥à¹ˆ": "Spare Parts",
      "à¸­à¸·à¹ˆà¸™à¹†": "Others",
      "à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²": "Product Name",
      "à¸ˆà¸³à¸™à¸§à¸™à¸ªà¸´à¸™à¸„à¹‰à¸²": "Quantity",
      "à¸«à¸™à¹ˆà¸§à¸¢à¸™à¸±à¸š": "Unit",
      "à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡à¸ˆà¸±à¸”à¹€à¸à¹‡à¸š (Location)": "Storage Location",
      "à¸¢à¸à¹€à¸¥à¸´à¸": "Cancel",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸´à¸™à¸„à¹‰à¸²": "Save Product Info",
      "à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸´à¸™à¸„à¹‰à¸²": "Edit Product",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¹à¸à¹‰à¹„à¸‚": "Save Changes",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¸£à¸±à¸šà¸ªà¸´à¸™à¸„à¹‰à¸²à¹€à¸‚à¹‰à¸²à¸„à¸¥à¸±à¸‡": "Receive Product to Stock",
      "à¹€à¸¥à¸·à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸²": "Select Product",
      "à¸ˆà¸³à¸™à¸§à¸™à¸£à¸±à¸šà¹€à¸‚à¹‰à¸²": "Quantity to Receive",
      "à¹€à¸¥à¸‚à¸„à¸£à¸¸à¸ à¸±à¸“à¸‘à¹Œ / Serial Number": "Asset / Serial Number",
      "à¸§à¸±à¸™à¸«à¸¡à¸”à¸­à¸²à¸¢à¸¸à¸ªà¸´à¸™à¸„à¹‰à¸² (à¸–à¹‰à¸²à¸¡à¸µ)": "Exp. Date (if any)",
      "à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸” / à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸": "Details / Note",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¸£à¸±à¸šà¸ªà¸´à¸™à¸„à¹‰à¸²": "Save Received",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸šà¸´à¸à¸žà¸±à¸ªà¸”à¸¸à¸­à¸­à¸à¸ˆà¸²à¸à¸ªà¸•à¹‡à¸­à¸": "Issue Product from Stock",
      "à¹€à¸¥à¸·à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸²à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¹€à¸šà¸´à¸": "Select Product to Issue",
      "à¸ˆà¸³à¸™à¸§à¸™à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¹€à¸šà¸´à¸": "Quantity to Issue",
      "à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¹€à¸šà¸´à¸ / à¸œà¸¹à¹‰à¸£à¸±à¸šà¸¡à¸­à¸šà¸žà¸±à¸ªà¸”à¸¸": "Borrower / Receiver Name",
      "à¸§à¸±à¸•à¸–à¸¸à¸›à¸£à¸°à¸ªà¸‡à¸„à¹Œà¸à¸²à¸£à¹ƒà¸Šà¹‰à¸‡à¸²à¸™": "Purpose of Use",
      "à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¹ƒà¸™à¸­à¸­à¸Ÿà¸Ÿà¸´à¸¨": "Office Use",
      "à¸ªà¹ˆà¸‡à¸¡à¸­à¸šà¸¥à¸¹à¸à¸„à¹‰à¸²": "Deliver to Customer",
      "à¸‡à¸²à¸™à¸‹à¹ˆà¸­à¸¡à¸šà¸³à¸£à¸¸à¸‡": "Maintenance Work",
      "à¸—à¸”à¸ªà¸­à¸šà¸£à¸°à¸šà¸š": "System Testing",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸šà¸´à¸à¸ªà¸´à¸™à¸„à¹‰à¸²": "Save Issued",
      "à¸¥à¸‡à¸—à¸°à¹€à¸šà¸µà¸¢à¸™à¹€à¸žà¸´à¹ˆà¸¡à¸šà¸¸à¸„à¸¥à¸²à¸à¸£": "Register New Personnel",
      "à¸¢à¸¨ - à¸Šà¸·à¹ˆà¸­ - à¸™à¸²à¸¡à¸ªà¸à¸¸à¸¥": "Rank - Name - Surname",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥": "Save Data",
      "à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸² (à¹à¸à¹‰à¹„à¸‚à¹„à¸¡à¹ˆà¹„à¸”à¹‰)": "Product Code (Read-only)",
      "-- à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸² --": "-- Select Product --",
      "-- à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸œà¸¹à¹‰à¹€à¸šà¸´à¸ --": "-- Select Borrower --",
      "-- à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸§à¸±à¸•à¸–à¸¸à¸›à¸£à¸°à¸ªà¸‡à¸„à¹Œ --": "-- Select Purpose --",
      "à¸£à¸²à¸¢à¸à¸²à¸£à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”": "All Items",
      "à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸à¸¥à¹‰à¸«à¸¡à¸”": "Low Stock",
      "à¸ªà¸•à¹‡à¸­à¸à¸£à¸§à¸¡": "Total Stock",
      "à¸£à¸²à¸¢à¸à¸²à¸£à¸§à¸±à¸™à¸™à¸µà¹‰": "Today's Activity",
      "à¸œà¸¹à¹‰à¹ƒà¸Šà¹‰: ": "User: ",
      "à¸ˆà¸³à¸™à¸§à¸™": "Quantity",
      "à¸«à¸™à¹ˆà¸§à¸¢": "Unit",
      "à¸§à¸±à¸™à¸—à¸µà¹ˆà¸—à¸³à¸£à¸²à¸¢à¸à¸²à¸£": "Transaction Date",
      "à¸›à¸£à¸°à¹€à¸ à¸—": "Type",
      "à¸œà¸¹à¹‰à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£/à¸œà¸¹à¹‰à¹€à¸šà¸´à¸": "Operator/Borrower",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¸Šà¹ˆà¸§à¸¢à¸ˆà¸³/à¸§à¸±à¸•à¸–à¸¸à¸›à¸£à¸°à¸ªà¸‡à¸„à¹Œ": "Note/Purpose",
      "à¹ƒà¸šà¹€à¸šà¸´à¸": "Slip",
      "à¸›à¸à¸•à¸´à¸—à¸¸à¸à¸£à¸²à¸¢à¸à¸²à¸£": "All Items Normal",
      "à¸£à¸²à¸¢à¸à¸²à¸£": "Items",
      "à¸Šà¸´à¹‰à¸™": "Pcs",
      "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¹ƒà¸™à¸£à¸°à¸šà¸š": "No movement history in the system yet",
      "à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¸—à¸µà¹ˆà¸•à¸£à¸‡à¸à¸±à¸šà¸à¸²à¸£à¸„à¹‰à¸™à¸«à¸²": "No personnel found matching the search",
      "à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¸Šà¸·à¹ˆà¸­": "Unnamed",
      "à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥": "Edit Data",
      "à¸¥à¸šà¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­": "Delete Name",
      "à¸žà¸´à¸¡à¸žà¹Œà¹ƒà¸šà¹€à¸šà¸´à¸": "Print Slip",
      "ðŸ“Š à¸ à¸²à¸žà¸£à¸§à¸¡": "ðŸ“Š Overview",
      "ðŸ“¦ à¸ªà¸•à¹‡à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸²": "ðŸ“¦ Stock",
      "ðŸ“œ à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸šà¸´à¸-à¸£à¸±à¸š": "ðŸ“œ History",
      "ðŸ‘¥ à¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£": "ðŸ‘¥ Personnel",
      "ðŸ“‹ à¸£à¸²à¸¢à¸‡à¸²à¸™à¸£à¸²à¸Šà¸à¸²à¸£": "ðŸ“‹ Gov Reports",
      "à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸žà¸±à¸ªà¸”à¸¸à¸£à¸²à¸Šà¸à¸²à¸£": "Gov Requisition & Stock Report",
      "à¸ˆà¸±à¸”à¸—à¸³à¸£à¸²à¸¢à¸‡à¸²à¸™à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¹à¸¥à¸°à¸žà¸±à¸ªà¸”à¸¸à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¹€à¸žà¸·à¹ˆà¸­à¹€à¸ªà¸™à¸­à¸œà¸¹à¹‰à¸šà¸±à¸‡à¸„à¸±à¸šà¸šà¸±à¸à¸Šà¸²": "Generate reports of movement and stock balance for commanders",
      "à¸›à¸£à¸°à¹€à¸ à¸—à¸£à¸²à¸¢à¸‡à¸²à¸™": "Report Type",
      "à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸£à¸²à¸¢à¹€à¸”à¸·à¸­à¸™": "Monthly Summary Report",
      "à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸£à¸²à¸¢à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“": "Fiscal Year Summary Report",
      "à¹€à¸¥à¸·à¸­à¸à¹€à¸”à¸·à¸­à¸™": "Select Month",
      "à¹€à¸¥à¸·à¸­à¸à¸›à¸µ à¸„.à¸¨. (Calendar Year)": "Select Calendar Year",
      "à¹€à¸¥à¸·à¸­à¸à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“ (Fiscal Year B.E.)": "Select Fiscal Year (B.E.)",
      "à¸žà¸´à¸¡à¸žà¹Œà¸£à¸²à¸¢à¸‡à¸²à¸™ (Print PDF)": "Print Report (PDF)",
      "à¸ªà¹ˆà¸‡à¸­à¸­à¸ Excel (CSV)": "Export Excel (CSV)",
      "à¸Šà¸·à¹ˆà¸­à¸žà¸±à¸ªà¸”à¸¸": "Item Name",
      "à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ": "Category",
      "à¸ªà¸–à¸²à¸™à¸—à¸µà¹ˆà¹€à¸à¹‡à¸š": "Location",
      "à¸ˆà¸³à¸™à¸§à¸™à¸—à¸µà¹ˆà¸£à¸±à¸šà¹€à¸‚à¹‰à¸²": "Received Qty",
      "à¸ˆà¸³à¸™à¸§à¸™à¸—à¸µà¹ˆà¹€à¸šà¸´à¸à¸­à¸­à¸": "Issued Qty",
      "à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™": "Current Qty",
      "à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“:": "Fiscal Year:",
      "à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“": "Fiscal Year",
      "à¸¥à¹‰à¸²à¸‡à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”": "Clear All History",
      "à¸„à¸¸à¸“à¹à¸™à¹ˆà¹ƒà¸ˆà¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆà¸—à¸µà¹ˆà¸ˆà¸°à¸¥à¹‰à¸²à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”?\n*à¸à¸²à¸£à¸à¸£à¸°à¸—à¸³à¸™à¸µà¹‰à¸ˆà¸°à¸¥à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”à¸­à¸¢à¹ˆà¸²à¸‡à¸–à¸²à¸§à¸£à¹à¸¥à¸°à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸à¸¹à¹‰à¸„à¸·à¸™à¹„à¸”à¹‰*": "Are you sure you want to clear all movement history?\n*This action will permanently delete all history logs and cannot be undone.*",
      "à¸¥à¹‰à¸²à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸ªà¸³à¹€à¸£à¹‡à¸ˆ": "History cleared successfully",
      "à¸ˆà¸³à¸™à¸§à¸™à¸žà¸±à¸ªà¸”à¸¸à¸—à¸µà¹ˆà¹€à¸šà¸´à¸": "Quantity Issued",
      "à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸à¸²à¸£à¹€à¸šà¸´à¸": "No Requisitions"
    };

    let currentLang = 'th';

    function walkDOM(node) {
      if (node.nodeType === 3) {
        let text = node.textContent.trim();
        if (text) {
          if (!node._originalText) node._originalText = node.textContent;
          let key = node._originalText.trim();
          if (i18n[key]) {
            let prefix = node._originalText.substring(0, node._originalText.indexOf(key));
            let suffix = node._originalText.substring(node._originalText.indexOf(key) + key.length);
            node.textContent = prefix + (currentLang === 'en' ? i18n[key] : key) + suffix;
          }
        }
      } else if (node.nodeType === 1) {
        if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
        if (node.hasAttribute('placeholder')) {
          if (!node._originalPlaceholder) node._originalPlaceholder = node.getAttribute('placeholder');
          let key = node._originalPlaceholder;
          if (i18n[key]) {
            node.setAttribute('placeholder', currentLang === 'en' ? i18n[key] : key);
          }
        }
        Array.from(node.childNodes).forEach(walkDOM);
      }
    }

    function setLang(lang) {
      currentLang = lang;
      
      // Update buttons
      document.querySelectorAll('.btn-lang').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`.btn-lang[onclick="setLang('${lang}')"]`);
      if (activeBtn) activeBtn.classList.add('active');

      // Update static UI
      walkDOM(document.body);
      
      // Update dynamic UI
      renderDashboard();
      renderStock();
      renderHistory();
      renderPersonnel();
      if (typeof renderReport === 'function') renderReport();
      updateClock();
    }

    function t(text) {
      return (currentLang === 'en' && i18n[text]) ? i18n[text] : text;
    }

    // --- Real-time Clock ---
    function updateClock() {
      const now = new Date();
      const optionsTH = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const optionsEN = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const locale = currentLang === 'th' ? 'th-TH' : 'en-GB';
      const timeStr = now.toLocaleDateString(locale, currentLang === 'th' ? optionsTH : optionsEN);
      
      const clockSpan = document.querySelector('#realtimeClock span');
      if(clockSpan) clockSpan.textContent = timeStr;
    }
    setInterval(updateClock, 1000);

    // Personnel list defaults
    const DEFAULT_PERSONNEL = [
      {name: 'à¸™.à¸­.à¸šà¸¸à¸à¸—à¸§à¸µ à¸Šà¹ˆà¸§à¸¢à¹€à¸™à¸µà¸¢à¸¡', position: 'à¸«à¸.à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.', phone: '081-9129091'},
      {name: 'à¸™.à¸—.à¸«à¸à¸´à¸‡ à¸£à¸§à¸µà¸§à¸£à¸£à¸“ à¸à¸´à¸•à¸•à¸´à¸¨à¸±à¸à¸”à¸´à¹Œà¸à¸¸à¸¥', position: 'à¸£à¸­à¸‡ à¸«à¸.à¸à¸à¸¡.à¸šà¸.à¸‚à¸­.', phone: '094-5481842'},
      {name: 'à¸£.à¸­.à¸™à¸—à¸µ à¸à¸¥à¹‰à¸²à¹à¸‚à¹‡à¸‡', position: 'à¸™à¸›à¸.à¸à¸›à¸.à¸à¸à¸¡.à¸šà¸.à¸‚à¸­.', phone: '064-8320092'},
      {name: 'à¸£.à¸—.à¸˜à¸™à¸£à¸±à¸•à¸™à¹Œ à¸­à¸”à¸´à¸¨à¸±à¸¢à¸ªà¸à¸¸à¸¥à¸Šà¸±à¸¢', position: 'à¸™à¸§à¸ž.à¸œà¸§à¸ž.à¸à¸à¸¡.à¸šà¸.à¸‚à¸­.', phone: '094-7565591'},
      {name: 'à¸£.à¸•.à¸ˆà¸´à¸£à¸ à¸±à¸—à¸£ à¸ˆà¸³à¸›à¸²à¸‡à¸²à¸¡', position: 'à¸™.à¹‚à¸›à¸£à¹à¸à¸£à¸¡ à¸œà¸§à¸ž.à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.', phone: '095-5251415'},
      {name: 'à¸ž.à¸­.à¸­.à¸ªà¸¸à¸ à¸±à¸„ à¸­à¸±à¸¡à¸žà¸´à¸¥à¸²à¸¨à¸±à¸¢', position: 'à¸ˆà¸™à¸—.à¸žà¸±à¸ªà¸”à¸¸à¸­à¸²à¸§à¸¸à¹‚à¸ªà¸¯ à¸Šà¹ˆà¸§à¸¢à¸£à¸²à¸Šà¸à¸²à¸£ à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.', phone: '062-4248596'},
      {name: 'à¸ž.à¸­.à¸—.à¸Šà¸™à¸´à¸™à¸—à¸£à¹Œ à¸žà¸£à¸¡à¸¤à¸—à¸˜à¸´à¹Œ', position: 'à¸ˆà¸™à¸—.à¸—à¸”à¸ªà¸­à¸š à¸œà¸§à¸ž.à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.', phone: '099-7359773'},
      {name: 'à¸ˆ.à¸­.à¸“à¸˜à¸±à¸Šà¸žà¸‡à¸¨à¹Œ à¸ à¸¹à¹ˆà¸‚à¸±à¸™à¹€à¸‡à¸´à¸™', position: 'à¸ˆà¸™à¸—.à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ à¸à¸šà¸¡.à¸à¸à¸¡.à¸šà¸.à¸‚à¸­.', phone: '062-3902690'},
      {name: 'à¸ˆ.à¸—.à¸ à¸¹à¸¡à¸´à¸”à¸¥ à¸šà¸¸à¹‚à¸£à¸”à¸¡', position: 'à¸ˆà¸™à¸—.à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ à¸à¸šà¸¡.à¸à¸à¸¡.à¸šà¸.à¸‚à¸­.', phone: '094-1135337'},
      {name: 'à¸ˆ.à¸•.à¸ à¸±à¸—à¸£ à¸žà¸²à¸¢à¸¸à¸«à¸°', position: 'à¸ˆà¸™à¸—.à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸à¸²à¸£ à¸œà¸›à¸.à¸à¸à¸¡.à¸šà¸.à¸‚à¸­.', phone: '098-0167567'},
      {name: 'à¸™à¸²à¸‡à¸žà¸±à¸ªà¸§à¸µà¸žà¸´à¸Šà¸à¹Œ à¸«à¸µà¸šà¸ˆà¸´à¸™à¸”à¸²', position: 'à¸žà¸™à¸±à¸à¸‡à¸²à¸™à¸£à¸§à¸šà¸£à¸§à¸¡à¹à¸¥à¸°à¹€à¸•à¸£à¸µà¸¢à¸¡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥', phone: '095-6041354'},
      {name: 'à¸™à¸²à¸¢à¸ à¸¹à¸£à¸´à¸™à¸—à¸£à¹Œ à¸­à¸´à¸™à¸—à¸£à¹Œà¸šà¸¸à¸à¸Šà¹ˆà¸§à¸¢', position: 'à¸Šà¹ˆà¸²à¸‡à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¸¯ à¸Šà¹ˆà¸§à¸¢à¸£à¸²à¸Šà¸à¸²à¸£ à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.', phone: '095-4048230'}
    ];

    const fallbackProducts = [];

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const fallbackHistory = [];

    // Initialization
    window.addEventListener('DOMContentLoaded', () => {
      const loginPassEl = document.getElementById('loginPass');
      if (loginPassEl) {
        loginPassEl.addEventListener('keydown', e => { if(e.key === 'Enter') doLogin() });
      }
      
      loadDatabase();

      currentUser = 'admin';
      document.getElementById('userBadge').textContent = 'admin';
      document.getElementById('userAvatar').textContent = 'A';
      
      populatePersonnelSelect();
      renderPersonnel();
      populateFiscalYears();
      
      setLang('th');

      // Auth Check
      const isLoggedIn = sessionStorage.getItem('dpd_logged_in') === 'true';
      if (isLoggedIn) {
        currentUser = sessionStorage.getItem('dpd_current_user') || 'admin';
        document.getElementById('userBadge').textContent = currentUser;
        document.getElementById('userAvatar').textContent = currentUser.slice(0, 1).toUpperCase();
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');
        
        const activeTab = localStorage.getItem('dpd_active_tab') || 'dashboard';
        showTab(activeTab);
      }
    });

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTZIaVyt-aEuvHO7ckjqJJVhJYNP2vWXb1956nTnI5VCZ7HOu24DSOF4es4ubFbLxH/exec';

    // Loading indicator helpers for Google Sheets sync
    function showSyncLoading(message) {
      let loader = document.getElementById('apiSyncLoader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'apiSyncLoader';
        loader.style = `
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 99999;
          font-family: 'Sarabun', sans-serif;
          color: #f8fafc;
        `;
        loader.innerHTML = `
          <!-- Custom CSS for Cyber Spinner Animation -->
          <style>
            @keyframes cyber-spin-clockwise {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes cyber-spin-counter {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes cyber-glow-pulse {
              0%, 100% { filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.6)); }
              50% { filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.9)) drop-shadow(0 0 25px rgba(6, 182, 212, 0.5)); }
            }
          </style>

          <!-- Glowing Multi-Ring Cyber Loader -->
          <div class="cyber-loader-container" style="position: relative; width: 80px; height: 80px; margin-bottom: 25px; animation: cyber-glow-pulse 2s infinite ease-in-out;">
            <!-- Outer Ring (Indigo) -->
            <div style="
              position: absolute;
              inset: 0;
              border: 3px solid transparent;
              border-top: 3px solid #6366f1;
              border-bottom: 3px solid #6366f1;
              border-radius: 50%;
              animation: cyber-spin-clockwise 1.5s linear infinite;
            "></div>
            <!-- Middle Ring (Cyan) -->
            <div style="
              position: absolute;
              inset: 8px;
              border: 3px solid transparent;
              border-left: 3px solid #06b6d4;
              border-right: 3px solid #06b6d4;
              border-radius: 50%;
              opacity: 0.8;
              animation: cyber-spin-counter 1.2s linear infinite;
            "></div>
            <!-- Inner Dot Core (Glowing White/Blue) -->
            <div style="
              position: absolute;
              inset: 22px;
              background: radial-gradient(circle, #ffffff 0%, #6366f1 70%);
              border-radius: 50%;
              box-shadow: 0 0 12px #6366f1;
              opacity: 0.9;
            "></div>
          </div>
          <p id="apiSyncLoaderText" style="font-weight: 500; font-size: 15px; margin: 0; text-shadow: 0 2px 8px rgba(0,0,0,0.8); letter-spacing: 0.5px; color: #e2e8f0;"></p>
        `;
        document.body.appendChild(loader);
      }
      document.getElementById('apiSyncLoaderText').textContent = message;
      loader.style.display = 'flex';
    }

    function hideSyncLoading() {
      const loader = document.getElementById('apiSyncLoader');
      if (loader) loader.style.display = 'none';
    }

    async function loadDatabase() {
      // 1. Initial local cache load to show UI instantly
      let storedProducts, storedHistory, storedPersonnel;
      try { storedProducts = localStorage.getItem('dpd_products'); } catch (e) {}
      try { storedHistory = localStorage.getItem('dpd_history'); } catch (e) {}
      try { storedPersonnel = localStorage.getItem('dpd_personnel'); } catch (e) {}

      if (storedProducts) {
        try { products = JSON.parse(storedProducts); } catch (e) { products = fallbackProducts; }
      } else { products = fallbackProducts; }

      if (storedHistory) {
        try { history = JSON.parse(storedHistory); } catch (e) { history = fallbackHistory; }
      } else { history = fallbackHistory; }

      if (storedPersonnel) {
        try { PERSONNEL = JSON.parse(storedPersonnel); } catch (e) { PERSONNEL = DEFAULT_PERSONNEL; }
      } else { PERSONNEL = DEFAULT_PERSONNEL; }

      // Re-render views immediately with cached/default data so user can login/interact instantly
      renderDashboard();
      renderStock();
      renderHistory();
      renderPersonnel();
      populateFiscalYears();

      // 2. Fetch fresh data from Google Sheets Cloud Database silently in the background
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          products = data.products.map(p => ({
            code: p["à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²"] || p.code || '',
            name: p["à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²"] || p.name || '',
            cat: p["à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ"] || p.cat || 'à¸­à¸·à¹ˆà¸™à¹†',
            qty: parseInt(p["à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­"] || p.qty) || 0,
            min: parseInt(p["à¸‚à¸±à¹‰à¸™à¸•à¹ˆà¸³"] || p.min) || 0,
            unit: p["à¸«à¸™à¹ˆà¸§à¸¢à¸™à¸±à¸š"] || p.unit || 'à¸Šà¸´à¹‰à¸™',
            loc: p["à¸—à¸µà¹ˆà¹€à¸à¹‡à¸š"] || p.loc || ''
          }));
        }
        if (data.history && Array.isArray(data.history)) {
          history = data.history.map(h => ({
            date: h["à¸§à¸±à¸™à¸—à¸µà¹ˆ"] || h.date || '',
            type: h["à¸›à¸£à¸°à¹€à¸ à¸—"] || h.type || 'à¸›à¸£à¸±à¸šà¸›à¸£à¸¸à¸‡',
            code: h["à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²"] || h.code || '',
            name: h["à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²"] || h.name || '',
            qty: parseInt(h["à¸ˆà¸³à¸™à¸§à¸™"] || h.qty) || 0,
            user: h["à¸œà¸¹à¹‰à¸šà¸±à¸™à¸—à¸¶à¸"] || h.user || 'system',
            userPosition: h["à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡"] || h.userPosition || '',
            note: h["à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸"] || h.note || ''
          }));
        }
        if (data.personnel && Array.isArray(data.personnel) && data.personnel.length > 0) {
          PERSONNEL = data.personnel.map(p => ({
            name: p["à¸¢à¸¨-à¸Šà¸·à¹ˆà¸­-à¸ªà¸à¸¸à¸¥"] || p.name || '',
            position: p["à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡"] || p.position || '',
            phone: p["à¹€à¸šà¸­à¸£à¹Œà¹‚à¸—à¸£"] || p.phone || ''
          }));
        }

        // Cache loaded data locally
        localStorage.setItem('dpd_products', JSON.stringify(products));
        localStorage.setItem('dpd_history', JSON.stringify(history));
        localStorage.setItem('dpd_personnel', JSON.stringify(PERSONNEL));
      } catch (err) {
        console.error('Cloud Sync failed, using offline fallback cache:', err);
      } finally {
        hideSyncLoading();
        renderDashboard();
        renderStock();
        renderHistory();
        renderPersonnel();
        populateFiscalYears();
        populateUnitDatalist();
      }
    }

    async function saveDatabase() {
      // 1. Instantly save to local cache so the UI updates and user can continue immediately
      localStorage.setItem('dpd_products', JSON.stringify(products));
      localStorage.setItem('dpd_history', JSON.stringify(history));
      localStorage.setItem('dpd_personnel', JSON.stringify(PERSONNEL));

      // 2. POST updates to Google Sheets in the background silently
      // Convert standard JSON keys to Thai keys for Google Sheets compatibility
      const thaiProducts = products.map(p => ({
        "à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²": p.code,
        "à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²": p.name,
        "à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ": p.cat,
        "à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­": p.qty,
        "à¸‚à¸±à¹‰à¸™à¸•à¹ˆà¸³": p.min,
        "à¸«à¸™à¹ˆà¸§à¸¢à¸™à¸±à¸š": p.unit,
        "à¸—à¸µà¹ˆà¹€à¸à¹‡à¸š": p.loc
      }));

      const thaiHistory = history.map(h => ({
        "à¸§à¸±à¸™à¸—à¸µà¹ˆ": h.date,
        "à¸›à¸£à¸°à¹€à¸ à¸—": h.type,
        "à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²": h.code,
        "à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²": h.name,
        "à¸ˆà¸³à¸™à¸§à¸™": h.qty,
        "à¸œà¸¹à¹‰à¸šà¸±à¸™à¸—à¸¶à¸": h.user,
        "à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡": h.userPosition,
        "à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸": h.note
      }));

      const thaiPersonnel = PERSONNEL.map(p => ({
        "à¸¢à¸¨-à¸Šà¸·à¹ˆà¸­-à¸ªà¸à¸¸à¸¥": p.name,
        "à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡": p.position,
        "à¹€à¸šà¸­à¸£à¹Œà¹‚à¸—à¸£": p.phone
      }));

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: thaiProducts,
          history: thaiHistory,
          personnel: thaiPersonnel
        })
      }).then(() => {
        console.log('Background cloud database sync completed successfully.');
      }).catch(err => {
        console.error('Background cloud database sync failed:', err);
      });
    }

    function getRankWeight(name) {
      if (!name) return 0;
      if (name.startsWith('à¸™.à¸­.')) return 100;
      if (name.startsWith('à¸™.à¸—.')) return 90;
      if (name.startsWith('à¸£.à¸­.')) return 80;
      if (name.startsWith('à¸£.à¸—.')) return 70;
      if (name.startsWith('à¸£.à¸•.')) return 60;
      if (name.startsWith('à¸ž.à¸­.à¸­.')) return 55;
      if (name.startsWith('à¸ž.à¸­.à¸—.')) return 50;
      if (name.startsWith('à¸ž.à¸­.à¸•.')) return 45;
      if (name.startsWith('à¸ˆ.à¸­.')) return 40;
      if (name.startsWith('à¸ˆ.à¸—.')) return 35;
      if (name.startsWith('à¸ˆ.à¸•.')) return 30;
      return 0;
    }

    function sortPersonnelList() {
      PERSONNEL.sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        const wA = getRankWeight(nameA);
        const wB = getRankWeight(nameB);
        if (wB !== wA) return wB - wA;
        return nameA.localeCompare(nameB, 'th');
      });
    }

    function savePersonnelData() {
      sortPersonnelList();
      saveDatabase();
      populatePersonnelSelect();
    }

    function showToast(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      
      // Clear any existing toasts to prevent duplicates and stacking
      container.innerHTML = '';
      
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      let icon = type === 'danger' ? 'ti-circle-x' : (type === 'warning' ? 'ti-alert-circle' : 'ti-circle-check');
      toast.innerHTML = `<i class="ti ${icon}"></i><span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 15);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    function doLogin() {
      const p = document.getElementById('loginPass').value;
      const errEl = document.getElementById('loginErr');
      
      if (p === '36335') {
        currentUser = 'admin';
        // Persist session state
        sessionStorage.setItem('dpd_logged_in', 'true');
        sessionStorage.setItem('dpd_current_user', 'admin');
        
        errEl.style.display = 'none';
        document.getElementById('userBadge').textContent = 'admin';
        document.getElementById('userAvatar').textContent = 'A';
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');
        
        const activeTab = localStorage.getItem('dpd_active_tab') || 'dashboard';
        showTab(activeTab);
        showToast('à¸¢à¸´à¸™à¸”à¸µà¸•à¹‰à¸­à¸™à¸£à¸±à¸šà¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸£à¸°à¸šà¸š', 'success');
      } else {
        errEl.style.display = 'block';
        showToast('à¸£à¸«à¸±à¸ªà¸œà¹ˆà¸²à¸™à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡', 'danger');
      }
    }

    function doLogout() {
      currentUser = '';
      // Clear session state
      sessionStorage.removeItem('dpd_logged_in');
      sessionStorage.removeItem('dpd_current_user');
      localStorage.removeItem('dpd_active_tab');
      
      const loginPassEl = document.getElementById('loginPass');
      if (loginPassEl) {
        loginPassEl.value = '';
      }
      document.getElementById('mainApp').classList.remove('active');
      document.getElementById('loginScreen').classList.add('active');
      showToast('à¸­à¸­à¸à¸ˆà¸²à¸à¸£à¸°à¸šà¸šà¹€à¸£à¸µà¸¢à¸šà¸£à¹‰à¸­à¸¢', 'warning');
    }

    function showTab(name, element) {
      localStorage.setItem('dpd_active_tab', name);
      document.querySelectorAll('.nav-link').forEach(lnk => lnk.classList.remove('active'));
      const activeEl = element || document.getElementById('nav-' + name);
      if (activeEl) {
        activeEl.classList.add('active');
      }
      document.querySelectorAll('.view-container').forEach(v => v.style.display = 'none');
      const targetView = document.getElementById('tab-' + name);
      if (targetView) {
        targetView.style.display = 'block';
      }
      if (name === 'dashboard') renderDashboard();
      if (name === 'stock') renderStock();
      if (name === 'history') renderHistory();
      if (name === 'personnel') renderPersonnel();
      if (name === 'reports') renderReport();

      // Auto-close sidebar on mobile
      if (window.innerWidth <= 1024) {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (sidebar && sidebar.classList.contains('sidebar-open')) {
          sidebar.classList.remove('sidebar-open');
          if (backdrop) backdrop.classList.remove('sidebar-open');
        }
      }
    }

    // Toggle Sidebar for mobile view
    function toggleSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.querySelector('.sidebar-backdrop');
      if (sidebar) sidebar.classList.toggle('sidebar-open');
      if (backdrop) backdrop.classList.toggle('sidebar-open');
    }

    function renderDashboard() {
      const total = products.length;
      const lowList = products.filter(p => p.qty < p.min);
      const totalQty = products.reduce((a, p) => a + p.qty, 0);
      const txToday = history.filter(h => h.date === new Date().toISOString().slice(0, 10)).length;
      document.getElementById('dashCards').innerHTML = [
        {label: t('à¸£à¸²à¸¢à¸à¸²à¸£à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”'), val: total + ' ' + t('à¸£à¸²à¸¢à¸à¸²à¸£'), icon: 'ti-boxes', color: 'var(--color-primary)'},
        {label: t('à¸ªà¸´à¸™à¸„à¹‰à¸²à¹ƒà¸à¸¥à¹‰à¸«à¸¡à¸”'), val: lowList.length + ' ' + t('à¸£à¸²à¸¢à¸à¸²à¸£'), icon: 'ti-alert-triangle', color: 'var(--color-warning)'},
        {label: t('à¸ªà¸•à¹‡à¸­à¸à¸£à¸§à¸¡'), val: totalQty.toLocaleString() + ' ' + t('à¸Šà¸´à¹‰à¸™'), icon: 'ti-stack-2', color: 'var(--color-success)'},
        {label: t('à¸£à¸²à¸¢à¸à¸²à¸£à¸§à¸±à¸™à¸™à¸µà¹‰'), val: txToday + ' ' + t('à¸£à¸²à¸¢à¸à¸²à¸£'), icon: 'ti-activity', color: '#6366f1'}
      ].map(c => `<div class="dash-card"><div class="dash-card-icon" style="color: ${c.color}"><i class="ti ${c.icon}"></i></div><div class="dash-card-details"><h3>${c.label}</h3><div class="value">${c.val}</div></div></div>`).join('');
      
      const lowTableEl = document.getElementById('lowStockTable');
      if (lowList.length === 0) {
        lowTableEl.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-muted);">${t('à¸›à¸à¸•à¸´à¸—à¸¸à¸à¸£à¸²à¸¢à¸à¸²à¸£')}</div>`;
      } else {
        lowTableEl.innerHTML = `<table><thead><tr><th>${t('à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²')}</th><th>${t('à¸Šà¸·à¹ˆà¸­')}</th><th>${t('à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­')}</th><th>${t('à¸‚à¸±à¹‰à¸™à¸•à¹ˆà¸³')}</th></tr></thead><tbody>${lowList.map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td>${p.qty}</td><td>${p.min}</td></tr>`).join('')}</tbody></table>`;
      }
      
      // Update interactive analytics charts
      renderCharts();
    }

    function renderStock() {
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      const list = products.filter(p => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
      document.getElementById('stockTable').innerHTML = `<table><thead><tr><th>${t('à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²')}</th><th>${t('à¸Šà¸·à¹ˆà¸­')}</th><th>${t('à¸ˆà¸³à¸™à¸§à¸™')}</th><th>${t('à¸«à¸™à¹ˆà¸§à¸¢')}</th><th>${t('à¸ˆà¸±à¸”à¸à¸²à¸£')}</th></tr></thead><tbody>${list.map(p => `<tr><td>${p.code}</td><td style="user-select: none;">${p.name}</td><td>${p.qty}</td><td>${p.unit}</td><td style="display: flex; gap: 4px; justify-content: flex-end;"><button class="btn-action" style="background-color: var(--color-success); color: white; border-color: var(--color-success);" onclick="openRecvModal('${p.code}')" title="à¸£à¸±à¸šà¸ªà¸´à¸™à¸„à¹‰à¸²à¹€à¸‚à¹‰à¸²"><i class="ti ti-arrow-down-left"></i></button><button class="btn-action btn-action-edit" onclick="openEditModal('${p.code}')" title="à¹à¸à¹‰à¹„à¸‚"><i class="ti ti-edit"></i></button><button class="btn-action btn-action-delete" onclick="deleteProduct('${p.code}')" title="à¸¥à¸š"><i class="ti ti-trash"></i></button></td></tr>`).join('')}</tbody></table>`;
    }

    function populateSelects() {
      ['recvItem', 'issueItem'].forEach(id => {
        const s = document.getElementById(id);
        if (s) s.innerHTML = '<option value="">-- à¹€à¸¥à¸·à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸² --</option>' + products.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('');
      });
    }

    function openRecvModal(code) { 
      document.getElementById('recvItemSearch').value = '';
      document.getElementById('recvItem').value = '';
      
      if (code && typeof code === 'string') {
        const p = products.find(x => x.code === code);
        if (p) {
          document.getElementById('recvItemSearch').value = p.name;
          document.getElementById('recvItem').value = p.code;
        }
      }
      
      if (document.getElementById('clearRecvItemBtn')) {
        document.getElementById('clearRecvItemBtn').style.display = code ? 'block' : 'none';
      }
      document.getElementById('recvQty').value = '';
      document.getElementById('recvLot').value = '';
      document.getElementById('recvExp').value = '';
      document.getElementById('recvSource').value = '';
      document.getElementById('recvNote').value = '';
      document.getElementById('recvModal').classList.add('open'); 
    }
    function closeRecvModal() { document.getElementById('recvModal').classList.remove('open'); }

    function doReceive() {
      const code = document.getElementById('recvItem').value;
      const qty = parseInt(document.getElementById('recvQty').value);
      const source = document.getElementById('recvSource').value.trim();
      const lot = document.getElementById('recvLot').value.trim();
      const exp = document.getElementById('recvExp').value;
      const note = document.getElementById('recvNote').value.trim();

      const p = products.find(x => x.code === code);
      if (!code) {
        showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸²', 'danger');
        return;
      }
      if (isNaN(qty) || qty <= 0) {
        showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸ˆà¸³à¸™à¸§à¸™à¸£à¸±à¸šà¹€à¸‚à¹‰à¸²à¹ƒà¸«à¹‰à¸–à¸¹à¸à¸•à¹‰à¸­à¸‡', 'danger');
        return;
      }

      if (p) {
        const oldQty = p.qty;
        p.qty += qty;
        
        let details = [];
        if (source) details.push(`ที่มา: ${source}`);
        if (lot) details.push(`ลอต/SN: ${lot}`);
        if (exp) details.push(`EXP: ${formatThaiDate(exp)}`);
        if (note) details.push(`หมายเหตุ: ${note}`);
        
        const combinedNote = details.join(' | ') || 'รับสินค้าเข้าสต็อกคลังสินค้า';

        history.unshift({
          date: new Date().toISOString().slice(0, 10), 
          type: 'รับ', 
          code: p.code, 
          name: p.name, 
          qty: qty, 
          user: currentUser || 'admin', 
          note: `รับสินค้าเข้าสต็อก (ยอดเดิม: ${oldQty} -> ยอดใหม่: ${p.qty}) ${combinedNote ? `| ${combinedNote}` : '}`
        });
        
        saveDatabase();
        renderStock();
        closeRecvModal();
        showToast('à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¹à¸¥à¸°à¸›à¸£à¸±à¸šà¸›à¸£à¸¸à¸‡à¸¢à¸­à¸”à¸ªà¸´à¸™à¸„à¹‰à¸²à¸„à¸‡à¸„à¸¥à¸±à¸‡à¸ªà¸³à¹€à¸£à¹‡à¸ˆ', 'success');
      }
    }

    function openIssueModal() { 
      document.getElementById('issueItemSearch').value = '';
      document.getElementById('issueItem').value = '';
      if (document.getElementById('clearIssueItemBtn')) document.getElementById('clearIssueItemBtn').style.display = 'none';
      document.getElementById('issueQty').value = '';
      if (document.getElementById('issuePerson')) document.getElementById('issuePerson').value = '';
      if (document.getElementById('clearIssuePersonBtn')) document.getElementById('clearIssuePersonBtn').style.display = 'none';
      if (document.getElementById('issuePurpose')) document.getElementById('issuePurpose').selectedIndex = 0;
      if (document.getElementById('issueNote')) document.getElementById('issueNote').value = '';
      document.getElementById('issueModal').classList.add('open'); 
    }
    function closeIssueModal() { document.getElementById('issueModal').classList.remove('open'); }

    function doIssue() {
      const code = document.getElementById('issueItem').value;
      const qty = parseInt(document.getElementById('issueQty').value);
      const person = document.getElementById('issuePerson').value.trim();
      const purpose = document.getElementById('issuePurpose').value || 'à¹€à¸šà¸´à¸à¹ƒà¸Šà¹‰à¸‡à¸²à¸™';
      const note = document.getElementById('issueNote').value.trim();
      const combinedNote = note ? `${purpose} (${note})` : purpose;

      const p = products.find(x => x.code === code);
      if (p && qty > 0 && qty <= p.qty && person) {
        let personName = person;
        let personPosition = '';
        
        // Find position from PERSONNEL dynamically if it matches
        const found = PERSONNEL.find(x => (x.name || '').trim() === personName);
        if (found) {
          personPosition = found.position || '';
        }

        p.qty -= qty;
        history.unshift({
          date: new Date().toISOString().slice(0, 10),
          type: 'à¹€à¸šà¸´à¸',
          code: p.code,
          name: p.name,
          qty: qty,
          user: personName,
          userPosition: personPosition,
          note: combinedNote
        });
        saveDatabase();
        renderStock();
        closeIssueModal();
        showToast('à¹€à¸šà¸´à¸à¸ªà¸´à¸™à¸„à¹‰à¸²à¸ªà¸³à¹€à¸£à¹‡à¸ˆ');
      } else { showToast('à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡à¸«à¸£à¸·à¸­à¸ªà¸´à¸™à¸„à¹‰à¸²à¹„à¸¡à¹ˆà¸žà¸­', 'danger'); }
    }

    function formatUser(userStr, posStr) {
      if (!userStr) return '-';
      const name = userStr;
      const pos = posStr || '';
      if (pos) {
        return `<strong>${name}</strong><br><span style="font-size: 11px; color: var(--color-text-muted);">${pos}</span>`;
      }
      return `<strong>${name}</strong>`;
    }

    function renderHistory() {
      const container = document.getElementById('historyTable');
      if (!container) return;

      const filter = document.getElementById('histFilter').value;
      const fyFilter = document.getElementById('histFiscalFilter') ? document.getElementById('histFiscalFilter').value : '';
      const searchEl = document.getElementById('historySearchInput');
      const searchQ = searchEl ? searchEl.value.trim().toLowerCase() : '';

      let list = history;
      if (filter) {
        list = list.filter(h => h.type === filter);
      }
      if (fyFilter) {
        list = list.filter(h => String(getFiscalYear(h.date)) === String(fyFilter));
      }
      if (searchQ) {
        list = list.filter(h => 
          (h.code || '').toLowerCase().includes(searchQ) ||
          (h.name || '').toLowerCase().includes(searchQ) ||
          (h.user || '').toLowerCase().includes(searchQ) ||
          (h.userPosition || '').toLowerCase().includes(searchQ) ||
          (h.note || '').toLowerCase().includes(searchQ)
        );
      }

      if (list.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 48px; color: var(--color-text-muted);"><i class="ti ti-notes-off" style="font-size: 40px; display: block; margin-bottom: 12px;"></i>${t('à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¹ƒà¸™à¸£à¸°à¸šà¸š')}</div>`;
        return;
      }

      container.innerHTML = `<table><thead><tr><th>${t('à¸§à¸±à¸™à¸—à¸µà¹ˆà¸—à¸³à¸£à¸²à¸¢à¸à¸²à¸£')}</th><th>${t('à¸›à¸£à¸°à¹€à¸ à¸—')}</th><th>${t('à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²')}</th><th>${t('à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²')}</th><th style="text-align: right;">${t('à¸ˆà¸³à¸™à¸§à¸™')}</th><th>${t('à¸œà¸¹à¹‰à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£/à¸œà¸¹à¹‰à¹€à¸šà¸´à¸')}</th><th>${t('à¸šà¸±à¸™à¸—à¸¶à¸à¸Šà¹ˆà¸§à¸¢à¸ˆà¸³/à¸§à¸±à¸•à¸–à¸¸à¸›à¸£à¸°à¸ªà¸‡à¸„à¹Œ')}</th><th style="text-align: center; width: 100px;">${t('à¹ƒà¸šà¹€à¸šà¸´à¸')}</th></tr></thead><tbody>${list.map(h => {
        let badgeClass = 'badge-primary';
        if (h.type === 'à¸£à¸±à¸š') badgeClass = 'badge-success';
        if (h.type === 'à¹€à¸šà¸´à¸') badgeClass = 'badge-danger';
        if (h.type === 'à¹€à¸žà¸´à¹ˆà¸¡') badgeClass = 'badge-primary';
        if (h.type === 'à¹à¸à¹‰à¹„à¸‚') badgeClass = 'badge-warning';
        if (h.type === 'à¸›à¸£à¸±à¸šà¸›à¸£à¸¸à¸‡') badgeClass = 'badge-warning';
        if (h.type === 'à¸¥à¸š') badgeClass = 'badge-danger';

        let printBtn = '';
        if (h.type === 'à¹€à¸šà¸´à¸') {
          const origIndex = history.indexOf(h);
          printBtn = `<button class="btn-action btn-action-print" onclick="printIssueSlip(${origIndex})" title="${t('à¸žà¸´à¸¡à¸žà¹Œà¹ƒà¸šà¹€à¸šà¸´à¸')}"><i class="ti ti-printer"></i></button>`;
        } else {
          printBtn = '<span style="color:var(--color-text-muted); font-size:12px;">-</span>';
        }

        return `<tr><td><i class="ti ti-calendar-event" style="color: var(--color-text-muted);"></i> ${h.date}</td><td><span class="badge ${badgeClass}">${h.type === 'à¹€à¸šà¸´à¸' ? t('à¹€à¸šà¸´à¸à¸­à¸­à¸') : (h.type === 'à¸£à¸±à¸š' ? t('à¸£à¸±à¸šà¹€à¸‚à¹‰à¸²') : t(h.type))}</span></td><td><strong>${h.code}</strong></td><td>${h.name}</td><td style="text-align: right; font-weight: 600; ${h.type === 'à¹€à¸šà¸´à¸' ? 'color: var(--color-danger)' : (h.type === 'à¸£à¸±à¸š' ? 'color: var(--color-success)' : '')}">${h.type === 'à¹€à¸šà¸´à¸' ? '-' : '+'}${h.qty.toLocaleString()}</td><td>${formatUser(h.user, h.userPosition)}</td><td><span style="font-size: 13px; color: var(--color-text-secondary);">${h.note || '-'}</span></td><td style="text-align: center;">${printBtn}</td></tr>`;
      }).join('')}</tbody></table>`;
    }

    function formatThaiDate(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const y = parseInt(parts[0]) + 543;
      const m = parseInt(parts[1]);
      const d = parseInt(parts[2]);
      const months = ['à¸¡à¸à¸£à¸²à¸„à¸¡', 'à¸à¸¸à¸¡à¸ à¸²à¸žà¸±à¸™à¸˜à¹Œ', 'à¸¡à¸µà¸™à¸²à¸„à¸¡', 'à¹€à¸¡à¸©à¸²à¸¢à¸™', 'à¸žà¸¤à¸©à¸ à¸²à¸„à¸¡', 'à¸¡à¸´à¸–à¸¸à¸™à¸²à¸¢à¸™', 'à¸à¸£à¸à¸Žà¸²à¸„à¸¡', 'à¸ªà¸´à¸‡à¸«à¸²à¸„à¸¡', 'à¸à¸±à¸™à¸¢à¸²à¸¢à¸™', 'à¸•à¸¸à¸¥à¸²à¸„à¸¡', 'à¸žà¸¤à¸¨à¸ˆà¸´à¸à¸²à¸¢à¸™', 'à¸˜à¸±à¸™à¸§à¸²à¸„à¸¡'];
      return `${d} ${months[m - 1]} ${y}`;
    }

    function printIssueSlip(index) {
      const h = history[index];
      if (!h) return;
      
      const p = products.find(x => x.code === h.code);
      const unit = p ? p.unit : 'à¸Šà¸´à¹‰à¸™';
      
      const printWindow = window.open('', '_blank', 'width=800,height=700');
      if (!printWindow) return;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>&nbsp;</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
             body {
              font-family: 'Sarabun', sans-serif;
              padding: 40px;
              color: #1e293b;
              background: #ffffff;
              font-size: 15px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px double #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 22px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 6px;
            }
            .subtitle {
              font-size: 14px;
              color: #64748b;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .details-table th, .details-table td {
              padding: 12px 16px;
              border: 1px solid #cbd5e1;
              text-align: left;
            }
            .details-table th {
              background-color: #f8fafc;
              color: #334155;
              font-weight: 600;
              width: 30%;
            }
            .details-table td {
              color: #0f172a;
            }
            .signatures-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              margin-top: 60px;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px dotted #94a3b8;
              width: 90%;
              margin: 0 auto 12px auto;
              height: 40px;
            }
            .signature-box p {
              margin: 4px 0;
              font-size: 14px;
            }
            .signature-box .role {
              font-weight: 500;
              color: #475569;
            }
            .signature-box .name {
              font-weight: 600;
              color: #0f172a;
            }
            
            /* Screen view styles (clean loading card behind Chrome print dialog) */
            @media screen {
              body {
                background: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 24px;
              }
              .print-content {
                display: none !important;
              }
              .screen-preview {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
                text-align: center;
                max-width: 450px;
                width: 100%;
                box-sizing: border-box;
              }
              .spinner {
                border: 4px solid #f1f5f9;
                border-top: 4px solid #6366f1;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            }
            
            /* Print view styles */
            @media print {
              .screen-preview {
                display: none !important;
              }
              .print-content {
                display: block !important;
              }
              body {
                padding: 1.6cm 1.5cm 1.5cm 1.5cm;
                margin: 0;
                background: #ffffff;
              }
              @page {
                size: portrait;
                margin: 0; /* Force hide default browser headers and footers */
              }
            }
          </style>
        </head>
        <body>
          <div class="screen-preview">
            <div class="spinner"></div>
            <p style="font-weight: 600; font-size: 16px; margin: 0 0 8px 0; color: #0f172a;">à¸à¸³à¸¥à¸±à¸‡à¹€à¸£à¸µà¸¢à¸à¹ƒà¸Šà¹‰à¸«à¸™à¹‰à¸²à¸•à¹ˆà¸²à¸‡à¸žà¸´à¸¡à¸žà¹Œà¹ƒà¸šà¹€à¸šà¸´à¸à¸žà¸±à¸ªà¸”à¸¸</p>
            <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">à¸£à¸°à¸šà¸šà¸à¸³à¸¥à¸±à¸‡à¹€à¸›à¸´à¸”à¸à¸¥à¹ˆà¸­à¸‡à¸žà¸´à¸¡à¸žà¹Œà¸‚à¸­à¸‡à¹€à¸šà¸£à¸²à¸§à¹Œà¹€à¸‹à¸­à¸£à¹Œ à¸«à¸™à¹‰à¸²à¸•à¹ˆà¸²à¸‡à¸™à¸µà¹‰à¸ˆà¸°à¸›à¸´à¸”à¸•à¸±à¸§à¹€à¸­à¸‡à¹‚à¸”à¸¢à¸­à¸±à¸•à¹‚à¸™à¸¡à¸±à¸•à¸´à¹€à¸¡à¸·à¹ˆà¸­à¸žà¸´à¸¡à¸žà¹Œà¹€à¸ªà¸£à¹‡à¸ˆà¸«à¸£à¸·à¸­à¸¢à¸à¹€à¸¥à¸´à¸</p>
          </div>
          
          <div class="print-content">
            <div class="header">
              <div class="title">à¹ƒà¸šà¹€à¸šà¸´à¸à¸ˆà¹ˆà¸²à¸¢à¸žà¸±à¸ªà¸”à¸¸</div>
              <div class="subtitle">à¸à¸­à¸‡à¸à¸£à¸£à¸¡à¸§à¸´à¸˜à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥</div>
            </div>
          
          <table class="details-table">
            <tr>
              <th>à¸£à¸«à¸±à¸ªà¹ƒà¸šà¹€à¸šà¸´à¸</th>
              <td>TR-${h.date.replace(/-/g, '')}-${String(index + 1).padStart(4, '0')}</td>
            </tr>
            <tr>
              <th>à¸§à¸±à¸™à¸—à¸µà¹ˆà¸—à¸³à¸£à¸²à¸¢à¸à¸²à¸£</th>
              <td>${formatThaiDate(h.date)}</td>
            </tr>
            <tr>
              <th>à¸£à¸«à¸±à¸ªà¸žà¸±à¸ªà¸”à¸¸</th>
              <td><strong>${h.code}</strong></td>
            </tr>
            <tr>
              <th>à¸£à¸²à¸¢à¸à¸²à¸£à¸ªà¸´à¸™à¸„à¹‰à¸²/à¸žà¸±à¸ªà¸”à¸¸</th>
              <td>${h.name}</td>
            </tr>
            <tr>
              <th>à¸ˆà¸³à¸™à¸§à¸™à¸—à¸µà¹ˆà¹€à¸šà¸´à¸</th>
              <td style="font-size: 16px; font-weight: 700; color: #e11d48;">
                ${h.qty.toLocaleString()} ${unit}
              </td>
            </tr>
            <tr>
              <th>à¸œà¸¹à¹‰à¸‚à¸­à¹€à¸šà¸´à¸à¸žà¸±à¸ªà¸”à¸¸</th>
              <td><strong>${h.user}</strong> ${h.userPosition ? `(${h.userPosition})` : ''}</td>
            </tr>
            <tr>
              <th>à¸§à¸±à¸•à¸–à¸¸à¸›à¸£à¸°à¸ªà¸‡à¸„à¹Œ / à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸</th>
              <td>${h.note || '-'}</td>
            </tr>
          </table>
          
          <div class="signatures-grid">
            <div class="signature-box">
              <p class="role">à¸œà¸¹à¹‰à¸‚à¸­à¹€à¸šà¸´à¸à¸žà¸±à¸ªà¸”à¸¸</p>
              <div class="signature-line"></div>
              <p class="name">( ${h.user} )</p>
              <p style="font-size: 13px; color: #64748b;">${h.userPosition ? `à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡ ${h.userPosition}` : '&nbsp;'}</p>
              <p>à¸§à¸±à¸™à¸—à¸µà¹ˆ ........../........../..........</p>
            </div>
            <div class="signature-box">
              <p class="role">à¸œà¸¹à¹‰à¸ˆà¹ˆà¸²à¸¢à¸žà¸±à¸ªà¸”à¸¸</p>
              <div class="signature-line"></div>
              <p class="name">( à¸ž.à¸­.à¸­. à¸ªà¸¸à¸ à¸±à¸„ à¸­à¸±à¸¡à¸žà¸´à¸¥à¸²à¸¨à¸±à¸¢ )</p>
              <p style="font-size: 13px; color: #64748b;">à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡ à¸ˆà¸™à¸—.à¸žà¸±à¸ªà¸”à¸¸ à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.</p>
              <p>à¸§à¸±à¸™à¸—à¸µà¹ˆ ........../........../..........</p>
            </div>
            <div class="signature-box">
              <p class="role">à¸œà¸¹à¹‰à¸­à¸™à¸¸à¸¡à¸±à¸•à¸´à¸žà¸±à¸ªà¸”à¸¸</p>
              <div class="signature-line"></div>
              <p class="name">( à¸™.à¸­. à¸šà¸¸à¸à¸—à¸§à¸µ à¸Šà¹ˆà¸§à¸¢à¹€à¸™à¸µà¸¢à¸¡ )</p>
              <p style="font-size: 13px; color: #64748b;">à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡ à¸«à¸.à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.</p>
              <p>à¸§à¸±à¸™à¸—à¸µà¹ˆ ........../........../..........</p>
            </div>
            </div>
          </div>
          
          <scr` + `ipt>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </scr` + `ipt>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    function generateNextCode() {
      let maxNum = 0;
      products.forEach(p => {
        const match = p.code.match(/^DPD-(\d+)$/i);
        if (match) maxNum = Math.max(maxNum, parseInt(match[1]));
      });
      return 'DPD-' + String(maxNum + 1).padStart(3, '0');
    }

    function openAddModal() {
      document.getElementById('newCode').value = generateNextCode();
      document.getElementById('newName').value = '';
      document.getElementById('newQty').value = 0;
      document.getElementById('newUnit').value = '';
      document.getElementById('newLoc').value = '';
      document.getElementById('newCat').selectedIndex = 0;
      document.getElementById('addModal').classList.add('open');
    }
    function closeAddModal() { document.getElementById('addModal').classList.remove('open'); }

    function addProduct() {
      const code = document.getElementById('newCode').value.trim();
      const name = document.getElementById('newName').value.trim();
      const cat = document.getElementById('newCat').value;
      const qty = parseInt(document.getElementById('newQty').value) || 0;
      const min = Math.max(1, Math.floor(qty * 0.2)) || 10;
      const unit = document.getElementById('newUnit').value.trim() || 'à¸Šà¸´à¹‰à¸™';
      const loc = document.getElementById('newLoc').value.trim();
      
      const codeEl = document.getElementById('newCode');
      const nameEl = document.getElementById('newName');
      
      codeEl.style.borderColor = '';
      nameEl.style.borderColor = '';
      
      if (!code) {
        codeEl.style.borderColor = 'var(--color-danger)';
        showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²', 'danger');
        return;
      }
      if (!name) {
        nameEl.style.borderColor = 'var(--color-danger)';
        showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²', 'danger');
        return;
      }
      if (products.find(p => p.code.toLowerCase() === code.toLowerCase())) {
        codeEl.style.borderColor = 'var(--color-danger)';
        showToast('à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²à¸™à¸µà¹‰à¸‹à¹‰à¸³à¹à¸¥à¸°à¸–à¸¹à¸à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¸­à¸¢à¸¹à¹ˆà¹ƒà¸™à¸£à¸°à¸šà¸šà¹à¸¥à¹‰à¸§', 'danger');
        return;
      }
      
      products.push({ code, name, cat, qty, min, unit, loc });

      const combinedNote = 'à¸ˆà¸”à¸—à¸°à¹€à¸šà¸µà¸¢à¸™à¸žà¸±à¸ªà¸”à¸¸à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸«à¸¡à¹ˆà¹€à¸‚à¹‰à¸²à¸ªà¸•à¹‡à¸­à¸à¸„à¸¥à¸±à¸‡à¸ªà¸´à¸™à¸„à¹‰à¸²';

      history.unshift({
        date: new Date().toISOString().slice(0, 10),
        type: 'à¹€à¸žà¸´à¹ˆà¸¡',
        code,
        name,
        qty,
        user: currentUser || 'admin',
        note: combinedNote
      });
      saveDatabase();
      showToast(`à¸ˆà¸”à¸—à¸°à¹€à¸šà¸µà¸¢à¸™à¸ªà¸´à¸™à¸„à¹‰à¸² "${name}" à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`, 'success');
      closeAddModal();
      renderStock();
      renderDashboard();
    }

    function openEditModal(code) {
      const p = products.find(x => x.code === code);
      if (!p) return;
      document.getElementById('editCode').value = p.code;
      document.getElementById('editCat').value = p.cat;
      document.getElementById('editName').value = p.name;
      document.getElementById('editQty').value = p.qty;
      document.getElementById('editUnit').value = p.unit;
      document.getElementById('editLoc').value = p.loc || '';
      document.getElementById('editModal').classList.add('open');
    }

    function closeEditModal() { document.getElementById('editModal').classList.remove('open'); }

    function saveEditProduct() {
      const code = document.getElementById('editCode').value;
      const cat = document.getElementById('editCat').value;
      const name = document.getElementById('editName').value.trim();
      const qty = parseInt(document.getElementById('editQty').value) || 0;
      const min = Math.max(1, Math.floor(qty * 0.2)) || 10;
      const unit = document.getElementById('editUnit').value.trim() || 'à¸Šà¸´à¹‰à¸™';
      const loc = document.getElementById('editLoc').value.trim();
      
      const nameEl = document.getElementById('editName');
      nameEl.style.borderColor = '';
      
      if (!name) {
        nameEl.style.borderColor = 'var(--color-danger)';
        showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸Šà¸·à¹ˆà¸­à¸ªà¸´à¸™à¸„à¹‰à¸²', 'danger');
        return;
      }
      
      const p = products.find(x => x.code === code);
      if (!p) return;
      const oldQty = p.qty;
      
      p.cat = cat;
      p.name = name;
      p.qty = qty;
      p.min = min;
      p.unit = unit;
      p.loc = loc;
      
      if (oldQty !== qty) {
        history.unshift({
          date: new Date().toISOString().slice(0, 10),
          type: 'à¸›à¸£à¸±à¸šà¸›à¸£à¸¸à¸‡',
          code: p.code,
          name: p.name,
          qty: Math.abs(qty - oldQty),
          user: currentUser || 'admin',
          note: `à¸›à¸£à¸±à¸šà¸¢à¸­à¸”à¸ªà¸•à¹‡à¸­à¸à¹‚à¸”à¸¢à¸•à¸£à¸‡: ${oldQty} -> ${qty} ${unit}`
        });
      } else {
        history.unshift({
          date: new Date().toISOString().slice(0, 10),
          type: 'à¹à¸à¹‰à¹„à¸‚',
          code: p.code,
          name: p.name,
          qty: 0,
          user: currentUser || 'admin',
          note: 'à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸ªà¸´à¸™à¸„à¹‰à¸²'
        });
      }
      
      saveDatabase();
      showToast(`à¸›à¸£à¸±à¸šà¸›à¸£à¸¸à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸´à¸™à¸„à¹‰à¸² "${name}" à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`, 'success');
      closeEditModal();
      renderStock();
      renderDashboard();
    }

    function deleteProduct(code) {
      const p = products.find(x => x.code === code);
      if (!p) return;
      const confirmDelete = confirm(`à¸„à¸¸à¸“à¹à¸™à¹ˆà¹ƒà¸ˆà¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆà¸—à¸µà¹ˆà¸ˆà¸°à¸¥à¸šà¸ªà¸´à¸™à¸„à¹‰à¸² "${p.name}" (${p.code}) à¸­à¸­à¸à¸ˆà¸²à¸à¸£à¸°à¸šà¸š?\n*à¸„à¸³à¹€à¸•à¸·à¸­à¸™: à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸´à¸™à¸„à¹‰à¸²à¸Šà¸´à¹‰à¸™à¸™à¸µà¹‰à¸ˆà¸°à¸–à¸¹à¸à¸™à¸³à¸­à¸­à¸à¸­à¸¢à¹ˆà¸²à¸‡à¸–à¸²à¸§à¸£*`);
      if (!confirmDelete) return;
      
      history.unshift({
        date: new Date().toISOString().slice(0, 10),
        type: 'à¸¥à¸š',
        code: p.code,
        name: p.name,
        qty: p.qty,
        user: currentUser || 'admin',
        note: `à¸¥à¸šà¸ªà¸´à¸™à¸„à¹‰à¸²à¸­à¸­à¸à¸ˆà¸²à¸à¸£à¸°à¸šà¸š (à¸¢à¸­à¸”à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¹€à¸”à¸´à¸¡: ${p.qty} ${p.unit})`
      });
      
      products = products.filter(x => x.code !== code);
      saveDatabase();
      showToast(`à¸¥à¸šà¸ªà¸´à¸™à¸„à¹‰à¸² "${p.name}" à¸­à¸­à¸à¸ˆà¸²à¸à¸£à¸°à¸šà¸šà¸ªà¸³à¹€à¸£à¹‡à¸ˆ`, 'success');
      renderStock();
      renderDashboard();
    }

    function populatePersonnelSelect() {
      // Handled dynamically by autocomplete drop list
    }

    function populateUnitDatalist() {
      const datalist = document.getElementById('unitOptions');
      if (!datalist) return;
      
      const units = new Set();
      // Add existing product units
      products.forEach(p => {
        if (p.unit) units.add(p.unit.trim());
      });
      
      // Default common units
      ['à¸Šà¸´à¹‰à¸™', 'à¸­à¸±à¸™', 'à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡', 'à¸à¸¥à¹ˆà¸­à¸‡', 'à¹à¸žà¹‡à¸„', 'à¸¥à¸±à¸‡', 'à¸¡à¹‰à¸§à¸™', 'à¸‚à¸§à¸”', 'à¹€à¸ªà¹‰à¸™', 'à¸à¹‰à¸­à¸™', 'à¸£à¸µà¸¡', 'à¸•à¸¥à¸±à¸š', 'à¹ƒà¸š', 'à¸Šà¸¸à¸”'].forEach(u => units.add(u));
      
      datalist.innerHTML = Array.from(units)
        .filter(u => u !== '')
        .map(u => `<option value="${u}"></option>`)
        .join('');
    }

    function renderPersonnel() {
      const tbody = document.getElementById('personnelTableBody');
      if (!tbody) return;
      
      const searchEl = document.getElementById('searchPersonnelInput');
      const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
      
      const filtered = PERSONNEL.filter(p => 
        (p.name || '').toLowerCase().includes(q) || 
        (p.position || '').toLowerCase().includes(q)
      );
      
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 48px; color: var(--color-text-muted);"><i class="ti ti-users" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>${t('à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¸—à¸µà¹ˆà¸•à¸£à¸‡à¸à¸±à¸šà¸à¸²à¸£à¸„à¹‰à¸™à¸«à¸²')}</td></tr>`;
        return;
      }
      
      tbody.innerHTML = filtered.map(p => {
        const origIndex = PERSONNEL.indexOf(p);
        const name = p.name || t('à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¸Šà¸·à¹ˆà¸­');
        const position = p.position || '';
        const phone = p.phone || '-';
        return `<tr><td><strong>${name}</strong></td><td><span class="badge badge-primary">${position}</span></td><td><i class="ti ti-phone" style="color: var(--color-text-muted); margin-right: 6px;"></i>${phone}</td><td style="text-align: center;"><div style="display: flex; gap: 6px; justify-content: center;"><button class="btn-action btn-action-edit" onclick="openPersonnelModal(${origIndex})" title="${t('à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥')}"><i class="ti ti-edit"></i></button><button class="btn-action btn-action-delete" onclick="deletePersonnel(${origIndex})" title="${t('à¸¥à¸šà¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­')}"><i class="ti ti-trash"></i></button></div></td></tr>`;
      }).join('');
    }

    function openPersonnelModal(index = null) {
      const modal = document.getElementById('personnelModal');
      const titleEl = document.getElementById('personnelModalTitle');
      const indexInput = document.getElementById('personnelIndex');
      const nameInput = document.getElementById('personnelName');
      const posInput = document.getElementById('personnelPosition');
      const phoneInput = document.getElementById('personnelPhone');
      
      nameInput.style.borderColor = '';
      posInput.style.borderColor = '';
      
      if (index !== null && index >= 0) {
        titleEl.textContent = 'à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸¸à¸„à¸¥à¸²à¸à¸£';
        indexInput.value = index;
        nameInput.value = PERSONNEL[index].name;
        posInput.value = PERSONNEL[index].position;
        phoneInput.value = PERSONNEL[index].phone || '';
      } else {
        titleEl.textContent = 'à¸¥à¸‡à¸—à¸°à¹€à¸šà¸µà¸¢à¸™à¹€à¸žà¸´à¹ˆà¸¡à¸šà¸¸à¸„à¸¥à¸²à¸à¸£';
        indexInput.value = '';
        nameInput.value = '';
        posInput.value = '';
        phoneInput.value = '';
      }
      modal.classList.add('open');
    }

    function closePersonnelModal() { document.getElementById('personnelModal').classList.remove('open'); }

    function savePersonnel() {
      const idxVal = document.getElementById('personnelIndex').value;
      const nameVal = document.getElementById('personnelName').value.trim();
      const posVal = document.getElementById('personnelPosition').value.trim();
      const phoneVal = document.getElementById('personnelPhone').value.trim();
      
      const nameInput = document.getElementById('personnelName');
      const posInput = document.getElementById('personnelPosition');
      
      nameInput.style.borderColor = '';
      posInput.style.borderColor = '';
      
      if (!nameVal) {
        nameInput.style.borderColor = 'var(--color-danger)';
        showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸¢à¸¨à¹à¸¥à¸°à¸Šà¸·à¹ˆà¸­-à¸™à¸²à¸¡à¸ªà¸à¸¸à¸¥', 'danger');
        return;
      }
      if (!posVal) {
        posInput.style.borderColor = 'var(--color-danger)';
        showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡', 'danger');
        return;
      }

      if (idxVal !== '') {
        const idx = parseInt(idxVal);
        PERSONNEL[idx] = { name: nameVal, position: posVal, phone: phoneVal };
        showToast('à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¸ªà¸³à¹€à¸£à¹‡à¸ˆ', 'success');
      } else {
        if (PERSONNEL.find(p => p.name.toLowerCase() === nameVal.toLowerCase())) {
          nameInput.style.borderColor = 'var(--color-danger)';
          showToast('à¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¸™à¸µà¹‰à¸‹à¹‰à¸³à¹à¸¥à¸°à¸¡à¸µà¸­à¸¢à¸¹à¹ˆà¹à¸¥à¹‰à¸§à¹ƒà¸™à¸£à¸°à¸šà¸š', 'danger');
          return;
        }
        PERSONNEL.push({ name: nameVal, position: posVal, phone: phoneVal });
        showToast('à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¹ƒà¸«à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ', 'success');
      }
      savePersonnelData();
      closePersonnelModal();
      renderPersonnel();
    }

    function deletePersonnel(index) {
      const p = PERSONNEL[index];
      if (!p) return;
      const confirmDelete = confirm(`à¸„à¸¸à¸“à¹à¸™à¹ˆà¹ƒà¸ˆà¸—à¸µà¹ˆà¸ˆà¸°à¸¥à¸š "${p.name}" (${p.position}) à¸­à¸­à¸à¸ˆà¸²à¸à¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ?`);
      if (!confirmDelete) return;
      
      PERSONNEL.splice(index, 1);
      savePersonnelData();
      showToast('à¸¥à¸šà¸£à¸²à¸¢à¸Šà¸·à¹ˆà¸­à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¸ªà¸³à¹€à¸£à¹‡à¸ˆ', 'success');
      renderPersonnel();
    }

    // --- Government Reports & Fiscal Year Logic ---

    function getFiscalYear(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return '';
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const fyAD = month >= 10 ? year + 1 : year;
      return fyAD + 543;
    }

    function populateFiscalYears() {
      const years = new Set();
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentFY = (currentMonth >= 10 ? currentYear + 1 : currentYear) + 543;
      years.add(currentFY);
      years.add(currentFY - 1);
      years.add(currentFY - 2);

      history.forEach(h => {
        const fy = getFiscalYear(h.date);
        if (fy) years.add(fy);
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);

      const histSelect = document.getElementById('histFiscalFilter');
      if (histSelect) {
        histSelect.innerHTML = '<option value="">' + t('à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”') + '</option>' +
          sortedYears.map(y => `<option value="${y}">à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“ ${y}</option>`).join('');
      }

      const reportFiscalSelect = document.getElementById('reportFiscalYear');
      if (reportFiscalSelect) {
        reportFiscalSelect.innerHTML = sortedYears.map(y => `<option value="${y}">à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“ ${y}</option>`).join('');
        reportFiscalSelect.value = String(currentFY);
      }

      const reportYearSelect = document.getElementById('reportYear');
      if (reportYearSelect) {
        const calendarYears = new Set();
        calendarYears.add(currentYear);
        calendarYears.add(currentYear - 1);
        calendarYears.add(currentYear - 2);
        history.forEach(h => {
          if (h.date) {
            const y = parseInt(h.date.split('-')[0]);
            if (y) calendarYears.add(y);
          }
        });
        const sortedCalYears = Array.from(calendarYears).sort((a, b) => b - a);
        reportYearSelect.innerHTML = sortedCalYears.map(y => `<option value="${y}">${y + 543} (à¸„.à¸¨. ${y})</option>`).join('');
        reportYearSelect.value = String(currentYear);
      }

      const reportMonthSelect = document.getElementById('reportMonth');
      if (reportMonthSelect) {
        reportMonthSelect.value = String(currentMonth);
      }
    }

    function onReportFilterChange() {
      const reportType = document.getElementById('reportType').value;
      if (reportType === 'monthly') {
        document.getElementById('reportMonthGroup').style.display = 'block';
        document.getElementById('reportYearGroup').style.display = 'block';
        document.getElementById('reportFiscalGroup').style.display = 'none';
      } else {
        document.getElementById('reportMonthGroup').style.display = 'none';
        document.getElementById('reportYearGroup').style.display = 'none';
        document.getElementById('reportFiscalGroup').style.display = 'block';
      }
      renderReport();
    }

    function renderReport() {
      const reportType = document.getElementById('reportType').value;
      const month = parseInt(document.getElementById('reportMonth').value);
      const year = parseInt(document.getElementById('reportYear').value);
      const fy = parseInt(document.getElementById('reportFiscalYear').value);

      let filteredHistory = [];

      if (reportType === 'monthly') {
        filteredHistory = history.filter(h => {
          if (!h.date) return false;
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          return hYear === year && hMonth === month;
        });
      } else {
        filteredHistory = history.filter(h => {
          return getFiscalYear(h.date) === fy;
        });
      }

      const reportData = products.map(p => {
        const recv = filteredHistory
          .filter(h => h.code === p.code && (h.type === 'à¸£à¸±à¸š' || h.type === 'à¹€à¸žà¸´à¹ˆà¸¡'))
          .reduce((sum, h) => sum + h.qty, 0);

        const issue = filteredHistory
          .filter(h => h.code === p.code && h.type === 'à¹€à¸šà¸´à¸')
          .reduce((sum, h) => sum + h.qty, 0);

        return {
          code: p.code,
          name: p.name,
          cat: p.cat,
          unit: p.unit,
          loc: p.loc || '-',
          received: recv,
          issued: issue,
          currentQty: p.qty
        };
      });

      const container = document.getElementById('reportTableContainer');
      if (!container) return;

      let titleText = '';
      if (reportType === 'monthly') {
        const monthsTH = ['à¸¡à¸à¸£à¸²à¸„à¸¡', 'à¸à¸¸à¸¡à¸ à¸²à¸žà¸±à¸™à¸˜à¹Œ', 'à¸¡à¸µà¸™à¸²à¸„à¸¡', 'à¹€à¸¡à¸©à¸²à¸¢à¸™', 'à¸žà¸¤à¸©à¸ à¸²à¸„à¸¡', 'à¸¡à¸´à¸–à¸¸à¸™à¸²à¸¢à¸™', 'à¸à¸£à¸à¸Žà¸²à¸„à¸¡', 'à¸ªà¸´à¸‡à¸«à¸²à¸„à¸¡', 'à¸à¸±à¸™à¸¢à¸²à¸¢à¸™', 'à¸•à¸¸à¸¥à¸²à¸„à¸¡', 'à¸žà¸¤à¸¨à¸ˆà¸´à¸à¸²à¸¢à¸™', 'à¸˜à¸±à¸™à¸§à¸²à¸„à¸¡'];
        const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        titleText = currentLang === 'th' 
          ? `à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸žà¸±à¸ªà¸”à¸¸ à¸›à¸£à¸°à¸ˆà¸³à¹€à¸”à¸·à¸­à¸™ ${monthsTH[month - 1]} à¸›à¸µ à¸ž.à¸¨. ${year + 543}`
          : `Monthly Requisition Summary - ${monthsEN[month - 1]} ${year}`;
      } else {
        titleText = currentLang === 'th'
          ? `à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸žà¸±à¸ªà¸”à¸¸ à¸›à¸£à¸°à¸ˆà¸³à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“ à¸ž.à¸¨. ${fy}`
          : `Fiscal Year Requisition Summary - FY ${fy}`;
      }

      container.innerHTML = `
        <div style="margin-bottom: 16px; font-weight: 600; font-size: 15px; color: var(--color-text-primary); text-align: center; border-bottom: 2px solid var(--color-border); padding-bottom: 8px;">
          ${titleText}
        </div>
        <table>
          <thead>
            <tr>
              <th>${t('à¸£à¸«à¸±à¸ªà¸ªà¸´à¸™à¸„à¹‰à¸²')}</th>
              <th>${t('à¸Šà¸·à¹ˆà¸­à¸žà¸±à¸ªà¸”à¸¸')}</th>
              <th>${t('à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ')}</th>
              <th>${t('à¸ªà¸–à¸²à¸™à¸—à¸µà¹ˆà¹€à¸à¹‡à¸š')}</th>
              <th style="text-align: right;">${t('à¸ˆà¸³à¸™à¸§à¸™à¸—à¸µà¹ˆà¸£à¸±à¸šà¹€à¸‚à¹‰à¸²')}</th>
              <th style="text-align: right;">${t('à¸ˆà¸³à¸™à¸§à¸™à¸—à¸µà¹ˆà¹€à¸šà¸´à¸à¸­à¸­à¸')}</th>
              <th style="text-align: right;">${t('à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™')}</th>
              <th>${t('à¸«à¸™à¹ˆà¸§à¸¢à¸™à¸±à¸š')}</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map(r => `
              <tr>
                <td><strong>${r.code}</strong></td>
                <td>${r.name}</td>
                <td><span class="badge badge-primary">${t(r.cat)}</span></td>
                <td>${r.loc}</td>
                <td style="text-align: right; font-weight: 500; color: var(--color-success);">${r.received > 0 ? '+' + r.received.toLocaleString() : '0'}</td>
                <td style="text-align: right; font-weight: 500; color: var(--color-danger);">${r.issued > 0 ? '-' + r.issued.toLocaleString() : '0'}</td>
                <td style="text-align: right; font-weight: 600;">${r.currentQty.toLocaleString()}</td>
                <td>${t(r.unit)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    function printReport() {
      const reportType = document.getElementById('reportType').value;
      const month = parseInt(document.getElementById('reportMonth').value);
      const year = parseInt(document.getElementById('reportYear').value);
      const fy = parseInt(document.getElementById('reportFiscalYear').value);

      let filteredHistory = [];
      if (reportType === 'monthly') {
        filteredHistory = history.filter(h => {
          if (!h.date) return false;
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          return hYear === year && hMonth === month;
        });
      } else {
        filteredHistory = history.filter(h => getFiscalYear(h.date) === fy);
      }

      const reportData = products.map(p => {
        const recv = filteredHistory
          .filter(h => h.code === p.code && h.type === 'à¸£à¸±à¸š')
          .reduce((sum, h) => sum + h.qty, 0);

        const issue = filteredHistory
          .filter(h => h.code === p.code && h.type === 'à¹€à¸šà¸´à¸')
          .reduce((sum, h) => sum + h.qty, 0);

        return {
          code: p.code,
          name: p.name,
          cat: p.cat,
          unit: p.unit,
          loc: p.loc || '-',
          received: recv,
          issued: issue,
          currentQty: p.qty
        };
      });

      let reportTitle = '';
      if (reportType === 'monthly') {
        const monthsTH = ['à¸¡à¸à¸£à¸²à¸„à¸¡', 'à¸à¸¸à¸¡à¸ à¸²à¸žà¸±à¸™à¸˜à¹Œ', 'à¸¡à¸µà¸™à¸²à¸„à¸¡', 'à¹€à¸¡à¸©à¸²à¸¢à¸™', 'à¸žà¸¤à¸©à¸ à¸²à¸„à¸¡', 'à¸¡à¸´à¸–à¸¸à¸™à¸²à¸¢à¸™', 'à¸à¸£à¸à¸Žà¸²à¸„à¸¡', 'à¸ªà¸´à¸‡à¸«à¸²à¸„à¸¡', 'à¸à¸±à¸™à¸¢à¸²à¸¢à¸™', 'à¸•à¸¸à¸¥à¸²à¸„à¸¡', 'à¸žà¸¤à¸¨à¸ˆà¸´à¸à¸²à¸¢à¸™', 'à¸˜à¸±à¸™à¸§à¸²à¸„à¸¡'];
        reportTitle = `à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸žà¸±à¸ªà¸”à¸¸à¸›à¸£à¸°à¸ˆà¸³à¹€à¸”à¸·à¸­à¸™ ${monthsTH[month - 1]} à¸ž.à¸¨. ${year + 543}`;
      } else {
        reportTitle = `à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸žà¸±à¸ªà¸”à¸¸à¸›à¸£à¸°à¸ˆà¸³à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“ à¸ž.à¸¨. ${fy}`;
      }

      const printWindow = window.open('', '_blank', 'width=1000,height=800');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>&nbsp;</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Sarabun', sans-serif;
              padding: 30px;
              color: #000000;
              background: #ffffff;
              font-size: 14px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
            }
            .title {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 13px;
              color: #333333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 13px;
            }
            th, td {
              border: 1px solid #000000;
              padding: 8px 10px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: 600;
              text-align: center;
            }
            td.num {
              text-align: right;
            }
            .footer-section {
              margin-top: 40px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
            }
            .signature-block {
              text-align: center;
            }
            .sig-line {
              border-bottom: 1px dotted #000000;
              width: 70%;
              margin: 40px auto 10px auto;
            }
            
            /* Screen view styles */
            @media screen {
              body {
                background: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 24px;
              }
              .print-content {
                display: none !important;
              }
              .screen-preview {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
                text-align: center;
                max-width: 450px;
                width: 100%;
                box-sizing: border-box;
              }
              .spinner {
                border: 4px solid #f1f5f9;
                border-top: 4px solid #6366f1;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            }
            
            /* Print view styles */
            @media print {
              .screen-preview {
                display: none !important;
              }
              .print-content {
                display: block !important;
              }
              body {
                padding: 1.5cm 2cm;
                margin: 0;
                background: #ffffff;
              }
              @page {
                size: landscape;
                margin: 0; /* Force hide default browser headers and footers */
              }
            }
          </style>
        </head>
        <body>
          <div class="screen-preview">
            <div class="spinner"></div>
            <p style="font-weight: 600; font-size: 16px; margin: 0 0 8px 0; color: #0f172a; font-family: 'Sarabun', sans-serif;">à¸à¸³à¸¥à¸±à¸‡à¹€à¸£à¸µà¸¢à¸à¹ƒà¸Šà¹‰à¸«à¸™à¹‰à¸²à¸•à¹ˆà¸²à¸‡à¸žà¸´à¸¡à¸žà¹Œà¸£à¸²à¸¢à¸‡à¸²à¸™à¸žà¸±à¸ªà¸”à¸¸</p>
            <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; font-family: 'Sarabun', sans-serif;">à¸£à¸°à¸šà¸šà¸à¸³à¸¥à¸±à¸‡à¹€à¸›à¸´à¸”à¸à¸¥à¹ˆà¸­à¸‡à¸žà¸´à¸¡à¸žà¹Œà¸‚à¸­à¸‡à¹€à¸šà¸£à¸²à¸§à¹Œà¹€à¸‹à¸­à¸£à¹Œ à¸«à¸™à¹‰à¸²à¸•à¹ˆà¸²à¸‡à¸™à¸µà¹‰à¸ˆà¸°à¸›à¸´à¸”à¸•à¸±à¸§à¹€à¸­à¸‡à¹‚à¸”à¸¢à¸­à¸±à¸•à¹‚à¸™à¸¡à¸±à¸•à¸´à¹€à¸¡à¸·à¹ˆà¸­à¸žà¸´à¸¡à¸žà¹Œà¹€à¸ªà¸£à¹‡à¸ˆà¸«à¸£à¸·à¸­à¸¢à¸à¹€à¸¥à¸´à¸</p>
          </div>
          
          <div class="print-content">
            <div class="header">
              <div class="title">${reportTitle}</div>
              <div class="subtitle">à¸à¸­à¸‡à¸à¸£à¸£à¸¡à¸§à¸´à¸˜à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥</div>
            </div>
          <table>
            <thead>
              <tr>
                <th>à¸¥à¸³à¸”à¸±à¸š</th>
                <th>à¸£à¸«à¸±à¸ªà¸žà¸±à¸ªà¸”à¸¸</th>
                <th>à¸Šà¸·à¹ˆà¸­à¸£à¸²à¸¢à¸à¸²à¸£à¸žà¸±à¸ªà¸”à¸¸</th>
                <th>à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ</th>
                <th>à¸ªà¸–à¸²à¸™à¸—à¸µà¹ˆà¸ˆà¸±à¸”à¹€à¸à¹‡à¸š</th>
                <th>à¸ˆà¸³à¸™à¸§à¸™à¸£à¸±à¸šà¹€à¸‚à¹‰à¸²</th>
                <th>à¸ˆà¸³à¸™à¸§à¸™à¹€à¸šà¸´à¸à¸­à¸­à¸</th>
                <th>à¸¢à¸­à¸”à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™</th>
                <th>à¸«à¸™à¹ˆà¸§à¸¢à¸™à¸±à¸š</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map((r, i) => `
                <tr>
                  <td style="text-align: center;">${i + 1}</td>
                  <td>${r.code}</td>
                  <td>${r.name}</td>
                  <td>${r.cat}</td>
                  <td>${r.loc}</td>
                  <td class="num">${r.received.toLocaleString()}</td>
                  <td class="num">${r.issued.toLocaleString()}</td>
                  <td class="num" style="font-weight: 600;">${r.currentQty.toLocaleString()}</td>
                  <td style="text-align: center;">${r.unit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer-section">
            <div class="signature-block">
              <p>à¹€à¸ˆà¹‰à¸²à¸«à¸™à¹‰à¸²à¸—à¸µà¹ˆà¸œà¸¹à¹‰à¸ˆà¸±à¸”à¸—à¸³à¸£à¸²à¸¢à¸‡à¸²à¸™</p>
              <div class="sig-line"></div>
              <p>( à¸ž.à¸­.à¸­. à¸ªà¸¸à¸ à¸±à¸„ à¸­à¸±à¸¡à¸žà¸´à¸¥à¸²à¸¨à¸±à¸¢ )</p>
              <p>à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡ à¸ˆà¸™à¸—.à¸žà¸±à¸ªà¸”à¸¸ à¸à¸à¸¡.à¸šà¸.à¸‹Ð¾.</p>
              <p>à¸§à¸±à¸™à¸—à¸µà¹ˆ ........../........../..........</p>
            </div>
            <div class="signature-block">
              <p>à¸œà¸¹à¹‰à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¸„à¸§à¸²à¸¡à¸–à¸¹à¸à¸•à¹‰à¸­à¸‡</p>
              <div class="sig-line"></div>
              <p>( à¸™.à¸­. à¸šà¸¸à¸à¸—à¸§à¸µ à¸Šà¹ˆà¸§à¸¢à¹€à¸™à¸µà¸¢à¸¡ )</p>
              <p>à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡ à¸«à¸.à¸à¸à¸¡.à¸šà¸.à¸‹Ð¾.</p>
              <p>à¸§à¸±à¸™à¸—à¸µà¹ˆ ........../........../..........</p>
            </div>
            </div>
          </div>
          
          <scr` + `ipt>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </scr` + `ipt>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    function exportReportCSV() {
      const reportType = document.getElementById('reportType').value;
      const month = parseInt(document.getElementById('reportMonth').value);
      const year = parseInt(document.getElementById('reportYear').value);
      const fy = parseInt(document.getElementById('reportFiscalYear').value);

      let filteredHistory = [];
      if (reportType === 'monthly') {
        filteredHistory = history.filter(h => {
          if (!h.date) return false;
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          return hYear === year && hMonth === month;
        });
      } else {
        filteredHistory = history.filter(h => getFiscalYear(h.date) === fy);
      }

      const reportData = products.map(p => {
        const recv = filteredHistory
          .filter(h => h.code === p.code && h.type === 'à¸£à¸±à¸š')
          .reduce((sum, h) => sum + h.qty, 0);

        const issue = filteredHistory
          .filter(h => h.code === p.code && h.type === 'à¹€à¸šà¸´à¸')
          .reduce((sum, h) => sum + h.qty, 0);

        return {
          code: p.code,
          name: p.name,
          cat: p.cat,
          unit: p.unit,
          loc: p.loc || '-',
          received: recv,
          issued: issue,
          currentQty: p.qty
        };
      });

      let reportTitle = '';
      if (reportType === 'monthly') {
        const monthsTH = ['à¸¡à¸à¸£à¸²à¸„à¸¡', 'à¸à¸¸à¸¡à¸ à¸²à¸žà¸±à¸™à¸˜à¹Œ', 'à¸¡à¸µà¸™à¸²à¸„à¸¡', 'à¹€à¸¡à¸©à¸²à¸¢à¸™', 'à¸žà¸¤à¸©à¸ à¸²à¸„à¸¡', 'à¸¡à¸´à¸–à¸¸à¸™à¸²à¸¢à¸™', 'à¸à¸£à¸à¸Žà¸²à¸„à¸¡', 'à¸ªà¸´à¸‡à¸«à¸²à¸„à¸¡', 'à¸à¸±à¸™à¸¢à¸²à¸¢à¸™', 'à¸•à¸¸à¸¥à¸²à¸„à¸¡', 'à¸žà¸¤à¸¨à¸ˆà¸´à¸à¸²à¸¢à¸™', 'à¸˜à¸±à¸™à¸§à¸²à¸„à¸¡'];
        reportTitle = `à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸žà¸±à¸ªà¸”à¸¸à¸›à¸£à¸°à¸ˆà¸³à¹€à¸”à¸·à¸­à¸™ ${monthsTH[month - 1]} à¸ž.à¸¨. ${year + 543}`;
      } else {
        reportTitle = `à¸£à¸²à¸¢à¸‡à¸²à¸™à¸ªà¸£à¸¸à¸›à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸žà¸±à¸ªà¸”à¸¸à¸›à¸£à¸°à¸ˆà¸³à¸›à¸µà¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“ à¸ž.à¸¨. ${fy}`;
      }

      let csvRows = [];
      csvRows.push('\ufeff'); 
      csvRows.push(`"${reportTitle}"`);
      csvRows.push(`"à¸ªà¸³à¸™à¸±à¸à¸‡à¸²à¸™à¸žà¸±à¸’à¸™à¸²à¹à¸¥à¸°à¸¡à¸²à¸•à¸£à¸à¸²à¸™ (à¸à¸à¸¡.à¸šà¸.à¸‹à¸­.)"`);
      csvRows.push('');
      csvRows.push('"à¸£à¸«à¸±à¸ªà¸žà¸±à¸ªà¸”à¸¸","à¸Šà¸·à¹ˆà¸­à¸£à¸²à¸¢à¸à¸²à¸£","à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ","à¸ªà¸–à¸²à¸™à¸—à¸µà¹ˆà¹€à¸à¹‡à¸š","à¸ˆà¸³à¸™à¸§à¸™à¸£à¸±à¸šà¹€à¸‚à¹‰à¸²","à¸ˆà¸³à¸™à¸§à¸™à¹€à¸šà¸´à¸à¸­à¸­à¸","à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™","à¸«à¸™à¹ˆà¸§à¸¢à¸™à¸±à¸š"');

      reportData.forEach(r => {
        csvRows.push(`"${r.code}","${r.name}","${r.cat}","${r.loc}",${r.received},${r.issued},${r.currentQty},"${r.unit}"`);
      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('à¸ªà¹ˆà¸‡à¸­à¸­à¸à¹„à¸Ÿà¸¥à¹Œ Excel (CSV) à¸ªà¸³à¹€à¸£à¹‡à¸ˆ');
    }

    function clearHistory() {
      const confirmClear = confirm(t('à¸„à¸¸à¸“à¹à¸™à¹ˆà¹ƒà¸ˆà¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆà¸—à¸µà¹ˆà¸ˆà¸°à¸¥à¹‰à¸²à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”?\n*à¸à¸²à¸£à¸à¸£à¸°à¸—à¸³à¸™à¸µà¹‰à¸ˆà¸°à¸¥à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”à¸­à¸¢à¹ˆà¸²à¸‡à¸–à¸²à¸§à¸£à¹à¸¥à¸°à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸à¸¹à¹‰à¸„à¸·à¸™à¹„à¸”à¹‰*'));
      if (confirmClear) {
        history = [{
          date: new Date().toISOString().slice(0, 10),
          type: 'à¸¥à¸š',
          code: '-',
          name: 'System',
          qty: 0,
          user: currentUser || 'admin',
          note: 'à¸œà¸¹à¹‰à¸”à¸¹à¹à¸¥à¸£à¸°à¸šà¸šà¸ªà¸±à¹ˆà¸‡à¸¥à¹‰à¸²à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”'
        }];
        saveDatabase();
        renderHistory();
        renderDashboard();
        populateFiscalYears();
        showToast(t('à¸¥à¹‰à¸²à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸ªà¸³à¹€à¸£à¹‡à¸ˆ'), 'success');
      }
    }

    // --- Search Autocomplete for Personnel ---
    function filterPersonnelDropdown(val) {
      const container = document.getElementById('personnelSuggestions');
      if (!container) return;
      
      const q = val.trim().toLowerCase();
      
      const matches = q.length === 0
        ? PERSONNEL
        : PERSONNEL.filter(p => 
            (p.name || '').toLowerCase().includes(q) || 
            (p.position || '').toLowerCase().includes(q)
          );
      
      if (matches.length === 0) {
        container.style.display = 'none';
        return;
      }
      
      container.innerHTML = matches.map(p => `
        <div class="suggestion-item" onmousedown="selectPersonnelSuggestion('${p.name}')">
          <strong>${p.name}</strong>
        </div>
      `).join('');
      
      container.style.display = 'block';
    }

    function selectPersonnelSuggestion(value) {
      const input = document.getElementById('issuePerson');
      if (input) {
        input.value = value;
        toggleClearBtn(value);
      }
      hidePersonnelDropdown();
    }

    function hidePersonnelDropdown() {
      const container = document.getElementById('personnelSuggestions');
      if (container) {
        setTimeout(() => { container.style.display = 'none'; }, 150);
      }
    }

    // --- Autocomplete Helper functions for Clear Button ---
    function toggleClearBtn(val) {
      const btn = document.getElementById('clearIssuePersonBtn');
      if (btn) {
        btn.style.display = val.length > 0 ? 'block' : 'none';
      }
    }

    function clearIssuePersonInput() {
      const input = document.getElementById('issuePerson');
      if (input) {
        input.value = '';
        input.focus();
        filterPersonnelDropdown('');
        toggleClearBtn('');
      }
    }

    // --- Search Autocomplete for Products (Receive Modal) ---
    function filterRecvProductDropdown(val) {
      const container = document.getElementById('recvProductSuggestions');
      if (!container) return;
      
      const q = val.trim().toLowerCase();
      
      const matches = q.length === 0
        ? products
        : products.filter(p => 
            (p.code || '').toLowerCase().includes(q) || 
            (p.name || '').toLowerCase().includes(q)
          );
      
      const btn = document.getElementById('clearRecvItemBtn');
      if (btn) btn.style.display = val.length > 0 ? 'block' : 'none';

      if (matches.length === 0) {
        container.style.display = 'none';
        return;
      }
      
      container.innerHTML = matches.map(p => `
        <div class="suggestion-item" onmousedown="selectRecvProduct('${p.code}', '${p.code} - ${p.name}')">
          <strong>${p.code}</strong> - <span>${p.name}</span>
        </div>
      `).join('');
      
      container.style.display = 'block';
    }

    function selectRecvProduct(code, displayName) {
      const input = document.getElementById('recvItemSearch');
      const hiddenInput = document.getElementById('recvItem');
      if (input) input.value = displayName;
      if (hiddenInput) hiddenInput.value = code;
      const btn = document.getElementById('clearRecvItemBtn');
      if (btn) btn.style.display = 'block';

      // Find selected product to get unit dynamically
      const p = products.find(x => x.code === code);
      const unitLabel = document.getElementById('recvUnitLabel');
      if (unitLabel && p) {
        unitLabel.textContent = `(à¸«à¸™à¹ˆà¸§à¸¢: ${t(p.unit)})`;
      }

      hideRecvProductDropdown();
    }

    function hideRecvProductDropdown() {
      const container = document.getElementById('recvProductSuggestions');
      if (container) {
        setTimeout(() => { container.style.display = 'none'; }, 150);
      }
    }

    function clearRecvItemInput() {
      const input = document.getElementById('recvItemSearch');
      const hiddenInput = document.getElementById('recvItem');
      if (input) {
        input.value = '';
        input.focus();
      }
      if (hiddenInput) hiddenInput.value = '';
      const unitLabel = document.getElementById('recvUnitLabel');
      if (unitLabel) unitLabel.textContent = '';
      const btn = document.getElementById('clearRecvItemBtn');
      if (btn) btn.style.display = 'none';
      filterRecvProductDropdown('');
    }

    // --- Search Autocomplete for Products (Issue Modal) ---
    function filterIssueProductDropdown(val) {
      const container = document.getElementById('issueProductSuggestions');
      if (!container) return;
      
      const q = val.trim().toLowerCase();
      
      const matches = q.length === 0
        ? products
        : products.filter(p => 
            (p.code || '').toLowerCase().includes(q) || 
            (p.name || '').toLowerCase().includes(q)
          );
      
      const btn = document.getElementById('clearIssueItemBtn');
      if (btn) btn.style.display = val.length > 0 ? 'block' : 'none';

      if (matches.length === 0) {
        container.style.display = 'none';
        return;
      }
      
      container.innerHTML = matches.map(p => `
        <div class="suggestion-item" onmousedown="selectIssueProduct('${p.code}', '${p.code} - ${p.name}')">
          <strong>${p.code}</strong> - <span>${p.name}</span>
        </div>
      `).join('');
      
      container.style.display = 'block';
    }

    function selectIssueProduct(code, displayName) {
      const input = document.getElementById('issueItemSearch');
      const hiddenInput = document.getElementById('issueItem');
      if (input) input.value = displayName;
      if (hiddenInput) hiddenInput.value = code;
      const btn = document.getElementById('clearIssueItemBtn');
      if (btn) btn.style.display = 'block';

      // Find selected product to get unit dynamically
      const p = products.find(x => x.code === code);
      const unitLabel = document.getElementById('issueUnitLabel');
      if (unitLabel && p) {
        unitLabel.textContent = `(à¸«à¸™à¹ˆà¸§à¸¢: ${t(p.unit)})`;
      }

      hideIssueProductDropdown();
    }

    function hideIssueProductDropdown() {
      const container = document.getElementById('issueProductSuggestions');
      if (container) {
        setTimeout(() => { container.style.display = 'none'; }, 150);
      }
    }

    function clearIssueItemInput() {
      const input = document.getElementById('issueItemSearch');
      const hiddenInput = document.getElementById('issueItem');
      if (input) {
        input.value = '';
        input.focus();
      }
      if (hiddenInput) hiddenInput.value = '';
      const unitLabel = document.getElementById('issueUnitLabel');
      if (unitLabel) unitLabel.textContent = '';
      const btn = document.getElementById('clearIssueItemBtn');
      if (btn) btn.style.display = 'none';
      filterIssueProductDropdown('');
    }

    // --- Database Backup & Restore System ---
    function exportBackupData() {
      try {
        const backupObj = {
          products: products,
          history: history,
          personnel: PERSONNEL
        };
        const jsonString = JSON.stringify(backupObj, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const downloadAnchor = document.createElement('a');
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '_');
        downloadAnchor.setAttribute("href", url);
        downloadAnchor.setAttribute("download", `dpd_stock_backup_${dateStr}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        URL.revokeObjectURL(url);
        showToast('à¸ªà¸³à¸£à¸­à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹€à¸£à¸µà¸¢à¸šà¸£à¹‰à¸­à¸¢ (Backup JSON Downloaded)', 'success');
      } catch (e) {
        showToast('à¹€à¸à¸´à¸”à¸‚à¹‰à¸­à¸œà¸´à¸”à¸žà¸¥à¸²à¸”à¹ƒà¸™à¸à¸²à¸£à¸ªà¸³à¸£à¸­à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥', 'danger');
      }
    }

    function triggerRestoreUpload() {
      const fileInput = document.getElementById('restoreFileInput');
      if (fileInput) fileInput.click();
    }

    function importBackupData(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData && Array.isArray(importedData.products) && Array.isArray(importedData.history) && Array.isArray(importedData.personnel)) {
            const confirmRestore = confirm('à¸„à¸¸à¸“à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸à¸¹à¹‰à¸„à¸·à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¸°à¸šà¸šà¸”à¹‰à¸§à¸¢à¹„à¸Ÿà¸¥à¹Œà¸ªà¸³à¸£à¸­à¸‡à¸™à¸µà¹‰à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ?\n*à¸„à¸³à¹€à¸•à¸·à¸­à¸™: à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸žà¸±à¸ªà¸”à¸¸ à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸šà¸´à¸à¸ˆà¹ˆà¸²à¸¢ à¹à¸¥à¸°à¸šà¸¸à¸„à¸¥à¸²à¸à¸£à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”à¸—à¸µà¹ˆà¸¡à¸µà¸­à¸¢à¸¹à¹ˆà¹ƒà¸™à¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™à¸ˆà¸°à¸–à¸¹à¸à¹€à¸‚à¸µà¸¢à¸™à¸—à¸±à¸šà¸—à¸±à¸™à¸—à¸µ*');
            if (confirmRestore) {
              products = importedData.products;
              history = importedData.history;
              PERSONNEL = importedData.personnel;
              saveDatabase();
              
              // Refresh views and components
              renderDashboard();
              renderStock();
              renderHistory();
              renderPersonnel();
              populateFiscalYears();
              
              showToast('à¸à¸¹à¹‰à¸„à¸·à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸³à¹€à¸£à¹‡à¸ˆ (Database Restored)', 'success');
            }
          } else {
            showToast('à¹„à¸Ÿà¸¥à¹Œà¸ªà¸³à¸£à¸­à¸‡à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡ à¸«à¸£à¸·à¸­à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸œà¸´à¸”à¸žà¸¥à¸²à¸”', 'danger');
          }
        } catch (err) {
          showToast('à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸­à¹ˆà¸²à¸™à¹„à¸Ÿà¸¥à¹Œà¹„à¸”à¹‰ à¸«à¸£à¸·à¸­à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹ƒà¸™à¹„à¸Ÿà¸¥à¹Œà¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆ JSON', 'danger');
        }
        event.target.value = '';
      };
      reader.readAsText(file);
    }

    // --- Seamless Video Looping using Double Buffering to Prevent Looping Stutter ---
    window.addEventListener('DOMContentLoaded', () => {
      const v1 = document.getElementById('appBgVideo1');
      const v2 = document.getElementById('appBgVideo2');
      if (!v1 || !v2) return;

      v1.preload = 'auto';
      v2.preload = 'auto';

      let activeVideo = v1;
      let inactiveVideo = v2;
      let crossfading = false;

      // Safe autoplay trigger
      const playActive = () => {
        activeVideo.play().catch(e => {
          // Retry on interaction if blocked by autoplay policies
          document.addEventListener('click', () => {
            activeVideo.play();
          }, { once: true });
        });
      };
      playActive();

      function checkCrossfade() {
        if (crossfading) return;
        
        // Start crossfading 1.2 seconds before the current active video ends
        const crossfadeThreshold = 1.2; 
        if (activeVideo.duration && activeVideo.currentTime > activeVideo.duration - crossfadeThreshold) {
          crossfading = true;
          
          // Prepare the inactive video and start playing
          inactiveVideo.currentTime = 0;
          inactiveVideo.play().then(() => {
            // Fade out the current active video and fade in the inactive video
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');

            // Swap references
            const oldActive = activeVideo;
            activeVideo = inactiveVideo;
            inactiveVideo = oldActive;

            // Wait 1 second (matching CSS transition duration) before pausing the old video
            setTimeout(() => {
              inactiveVideo.pause();
              crossfading = false;
            }, 1000);
          }).catch(e => {
            console.log('Crossfade video play failed:', e);
            crossfading = false;
          });
        }
      }

      v1.addEventListener('timeupdate', checkCrossfade);
      v2.addEventListener('timeupdate', checkCrossfade);
    });

    // --- Dynamic Requisition Trend & Top Products Visualizations using Chart.js ---
    function renderCharts() {
      const monthlyTrendCtx = document.getElementById('monthlyTrendChart');
      if (!monthlyTrendCtx) return;

      const last6Months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last6Months.push({
          label: d.toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-GB', { month: 'short', year: 'numeric' }),
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          totalQty: 0
        });
      }

      // Sum quantities issued for each of the last 6 months
      history.forEach(h => {
        if (h.type === 'à¹€à¸šà¸´à¸' && h.date) {
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          const target = last6Months.find(m => m.year === hYear && m.month === hMonth);
          if (target) {
            target.totalQty += h.qty;
          }
        }
      });

      // Calculate Top 5 Issued Products
      const productTotals = {};
      history.forEach(h => {
        if (h.type === 'à¹€à¸šà¸´à¸') {
          const key = h.name || h.code;
          productTotals[key] = (productTotals[key] || 0) + h.qty;
        }
      });

      const topProducts = Object.entries(productTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const topLabels = topProducts.map(x => x[0]);
      const topData = topProducts.map(x => x[1]);

      // Destroy old charts to prevent duplicate instances
      if (window.monthlyTrendChartInstance) window.monthlyTrendChartInstance.destroy();
      if (window.topProductsChartInstance) window.topProductsChartInstance.destroy();

      // Premium styling variables matching cyber dark theme
      const gridColor = 'rgba(255, 255, 255, 0.05)';
      const textColor = '#cbd5e1';
      const font = { family: 'Sarabun, Inter, sans-serif', size: 12 };

      // Render Line Chart (Trend)
      window.monthlyTrendChartInstance = new Chart(monthlyTrendCtx, {
        type: 'line',
        data: {
          labels: last6Months.map(m => m.label),
          datasets: [{
            label: t('à¸ˆà¸³à¸™à¸§à¸™à¸žà¸±à¸ªà¸”à¸¸à¸—à¸µà¹ˆà¹€à¸šà¸´à¸'),
            data: last6Months.map(m => m.totalQty),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#ffffff',
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) { return ` ${context.parsed.y.toLocaleString()} ${t('à¸Šà¸´à¹‰à¸™')}`; }
              }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: font }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: font, stepSize: 1 }
            }
          }
        }
      });

      // Render Bar Chart (Top 5)
      const topBarCtx = document.getElementById('topProductsChart');
      if (!topBarCtx) return;

      window.topProductsChartInstance = new Chart(topBarCtx, {
        type: 'bar',
        data: {
          labels: topLabels.length > 0 ? topLabels : [t('à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸à¸²à¸£à¹€à¸šà¸´à¸')],
          datasets: [{
            label: t('à¸ˆà¸³à¸™à¸§à¸™à¸žà¸±à¸ªà¸”à¸¸à¸—à¸µà¹ˆà¹€à¸šà¸´à¸'),
            data: topData.length > 0 ? topData : [0],
            backgroundColor: [
              'rgba(99, 102, 241, 0.85)',
              'rgba(16, 185, 129, 0.85)',
              'rgba(244, 63, 94, 0.85)',
              'rgba(245, 158, 11, 0.85)',
              'rgba(59, 130, 246, 0.85)'
            ],
            borderRadius: 6,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) { return ` ${context.parsed.y.toLocaleString()} ${t('à¸Šà¸´à¹‰à¸™')}`; }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: font }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: font, stepSize: 1 }
            }
          }
        }
      });
    }
