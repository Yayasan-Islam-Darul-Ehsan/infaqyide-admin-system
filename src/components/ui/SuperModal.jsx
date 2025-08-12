// ModalContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from './Modal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {

    const [modalContent, setModalContent] = useState(null);

    const showModal = useCallback((content, props = {}) => {
        setModalContent({ content, props });
    }, []);

    const hideModal = useCallback(() => {
        setModalContent(null);
    }, []);

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modalContent && (
                <Modal
                    {...modalContent.props}
                    activeModal={true}
                    onClose={() => {
                        if (modalContent.props.onClose) {
                            hideModal();
                            modalContent.props.onClose();
                        }
                        hideModal();
                    }}
                >
                    {modalContent.content}
                </Modal>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};
