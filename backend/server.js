const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3308,
    user: "root",
    password: "123456",
    database: "awad_pos"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection error:", err);
    } else {
        console.log("MySQL Connected");
    }
});

app.get("/products", (req, res) => {
    db.query("SELECT *, (price - cost) AS profit FROM products ORDER BY id DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post("/products", (req, res) => {
    const { code, barcode, name, description, price, stock, image, cost } = req.body;

    const sql = `
        INSERT INTO products
        (code, barcode, name, description, price, stock, image, cost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        code || "",
        barcode || "",
        name || "",
        description || "",
        price || 0,
        stock || 0,
        image || "",
        cost || 0
    ], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product Added", id: result.insertId });
    });
});

app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const { code, barcode, name, description, price, stock, image, cost } = req.body;

    const sql = `
        UPDATE products
        SET code = ?, barcode = ?, name = ?, description = ?, price = ?, stock = ?, image = ?, cost = ?
        WHERE id = ?
    `;

    db.query(sql, [
        code || "",
        barcode || "",
        name || "",
        description || "",
        price || 0,
        stock || 0,
        image || "",
        cost || 0,
        id
    ], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product Updated" });
    });
});

app.delete("/products/:id", (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product Deleted" });
    });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});