import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import ButtonLoading from '../../loader/ButtonLoader';
import { contactUs } from '../../services/authService';
import { toast } from 'react-toastify';

const ContactUs = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handlePhotoChange = (e) => {
        const selectedPhoto = e.target.files[0];
        setPhoto(selectedPhoto);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !message) {
            toast.error('Subject and message are required');
            return;
        }
        setIsLoading(true);

        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('message', message);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            await contactUs(formData);
            setIsLoading(false);
            setMessage("");
            setSubject('');
            setPhoto(null);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setMessage("");
            setSubject('');
            setPhoto(null);
        }
    };

    return (
        <div className="container">
            <h1>Contact Us</h1>
            <Form onSubmit={handleSubmit} className='g-3 col-md-8' encType="multipart/form-data" style={{ fontSize: "1.5rem", padding: "1.5rem" }}>
                <FormGroup>
                    <Label for="subject">Subject</Label>
                    <Input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        value={subject}
                        onChange={handleSubjectChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="message">Message</Label>
                    <Input
                        type="textarea"
                        name="message"
                        id="message"
                        rows="5"
                        required
                        value={message}
                        onChange={handleMessageChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="photo">Photo</Label>
                    <Input
                        type="file"
                        name="photo"
                        id="photo"
                        onChange={handlePhotoChange}
                    />
                </FormGroup>
                {isLoading ? (
                    <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
                ) : (
                    <Button className="btn btn-lg btn-primary" type="submit">Submit</Button>
                )}
            </Form>
        </div>
    );
};

export default ContactUs;
