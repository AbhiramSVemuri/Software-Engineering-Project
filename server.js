const http = require('http');

// Start the server
const server = http.createServer((request, response) => {
    if (request.method === 'POST') {
        handlePostRequest(request, response);
    } else {
        response.writeHead(405); 
        response.end('Only POST method is supported');
    }
});

// Initialize SQL connection


/* Subteam 2 - Menu Requests
    - Open Menu - Get Menu from resturant ID, returns JSON
    - Add Item to Cart - Add Item to Cart, returns confirmation text
    - Delete Item - Deletes Item from Cart, returns confirmation text
    - Search Items - Search for Items in Menu                                   ----- Might be removed -------
    - List Item Categories - List all categories in Menu, returns JSON

*/

function openMenu(restaurantID, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error connecting to the database: ", err);
            callback(err, null);
            return;
        }

        const query = 'SELECT menu FROM restaurants WHERE id = ?';
        connection.query(query, [restaurantID], (error, results, fields) => {
            connection.release();

            if (error) {
                console.error("Error executing the query: ", error);
                callback(error, null);
                return;
            }

            let menu = results.length > 0 ? JSON.parse(results[0].menu) : null;
            callback(null, menu);
        });
    });
}

function addItem(itemID, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err, null);
            return;
        }

        const query = 'INSERT INTO items (id) VALUES (?)';
        connection.query(query, [itemID], (error, results, fields) => {
            connection.release();

            if (error) {
                callback(error, null);
                return;
            }

            callback(null, results);
        });
    });
}

function deleteItem(itemID, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err, null);
            return;
        }

        const query = 'DELETE FROM items WHERE id = ?';
        connection.query(query, [itemID], (error, results, fields) => {
            connection.release();

            if (error) {
                callback(error, null);
                return;
            }

            callback(null, results);
        });
    });
}

function searchItems(itemID, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err, null);
            return;
        }

        const query = 'SELECT * FROM items WHERE id = ?';
        connection.query(query, [itemID], (error, results, fields) => {
            connection.release();

            if (error) {
                callback(error, null);
                return;
            }

            callback(null, results);
        });
    });
}

function listItemCategories(restaurantID, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err, null);
            return;
        }

        const query = 'SELECT category FROM categories WHERE restaurant_id = ?';
        connection.query(query, [restaurantID], (error, results, fields) => {
            connection.release();

            if (error) {
                callback(error, null);
                return;
            }

            callback(null, results);
        });
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = server;