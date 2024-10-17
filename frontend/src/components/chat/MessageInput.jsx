import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAddMessageMutation } from '../../store/middlewares/messagesApi';
import leoProfanity from 'leo-profanity';

const MessageInput = () => {
  const {t} = useTranslation();
  const { currentChannelId } = useSelector((state) => state.channels);
  const username = useSelector((state) => state.auth.username);
  const inputRef = useRef(null);
  
  const [addMessage, { isLoading }] = useAddMessageMutation();

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values, { resetForm }) => {
      const message = {
        body: leoProfanity.clean(values.message),
        username,
        removable: true,
        channelId: currentChannelId,
        id: '',
      };

      try {
        await addMessage(message);
        resetForm();
      } catch (error) {
        console.error('Failed to send message:', error);
      }

      inputRef.current.focus();
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId]);

  return (
    <div className="mt-auto px-5 py-3">
      <Form className="p-0 rounded-3 border" noValidate onSubmit={formik.handleSubmit}>
        <InputGroup>
          <Form.Control
            className="border-0 p-0 ps-2"
            name="message"
            ref={inputRef}
            onChange={formik.handleChange}
            value={formik.values.message}
            disabled={isLoading}
            placeholder={t('message.enterMessage')}
            aria-label="new Message"
            autoComplete="off"
          />
          <Button
            className="ms-1"
            variant="outline-secondary"
            type="submit"
            disabled={!formik.values.message || isLoading}
            aria-label="submit"
          >
            {t('message.send')}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageInput;