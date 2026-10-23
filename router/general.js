
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Inscription d'un nouvel utilisateur
public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Le nom utilisateur et le mot de passe sont obligatoires'
        });
    }

    if (!isValid(username)) {
        users.push({
            username: username,
            password: password
        });

        return res.status(201).json({
            message: 'Utilisateur inscrit avec succès'
        });
    }

    return res.status(409).json({
        message: 'Ce nom utilisateur existe déjà'
    });
});

// Task 10 : obtenir la liste des livres
public_users.get('/', async (req, res) => {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des livres'
        });
    }
});

// Task 11 : obtenir un livre par ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        }

        return res.status(404).json({
            message: 'Livre introuvable'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la recherche du livre'
        });
    }
});

// Task 12 : obtenir les livres par auteur
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const result = Object.values(books).filter(book =>
            book.author &&
            book.author.toLowerCase() === author
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la recherche par auteur'
        });
    }
});

// Task 13 : obtenir les livres par titre
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const result = Object.values(books).filter(book =>
            book.title &&
            book.title.toLowerCase() === title
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la recherche par titre'
        });
    }
});

// Consulter les avis d'un livre
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: 'Livre introuvable'
        });
    }

    return res.status(200).json(books[isbn].reviews || {});
});

module.exports.general = public_users;
