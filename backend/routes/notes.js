const express = require('express');
const router = express.Router()
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');




// route1 : get all the Notes using :Get"/api/notes/fatchallnotes". login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal error occur");


    }
})

// route2 : Add a new note using :post"/api/notes/addnote". login required

router.post('/addnote', fetchuser, [
    body('title', 'enter valid title').isLength({ min: 3 }),
    body('description', 'Description must be larger than 5 charcter').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if there are error, return Bad request and the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()

        res.json(saveNote)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("some internal error occur");


    }
})

// route3 :Update the existing Note using :put"/api/notes/updatenote". login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;
    // create a newNote object
    try {

        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be update and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(401).send("not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal error occur");
    }



})
// route4 :delete the existing Note using :delete"/api/notes/deletenote". login required


router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;
    try {



        // find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(401).send("not found") }
        // deletion allowed only for right user


        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "success": "note is deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal error occur");

    }



})


module.exports = router
