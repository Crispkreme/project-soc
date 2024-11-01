import React from 'react';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));

const AccountModal = ({ showModal, toggleModal }) => {
  return (
    <Modal show={showModal} onClose={toggleModal}>

      <div className="p-6">
        <Title>
          {"Add New Account"}{" "}
          <span>
            {/* <MdOutlinePets /> */}
          </span>
        </Title>

        <form action="">

        </form>
        
      </div>

    </Modal>
  );
};

export default AccountModal;
