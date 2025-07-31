// /campeonato-ui/src/utils/toastUtils.js

import React from 'react';
import { toast } from 'react-toastify';
import ConfirmationToast from '../components/ConfirmationToast';

export const showConfirmation = (message, onConfirm) => {
  toast(<ConfirmationToast message={message} onConfirm={onConfirm} />, {
    position: "top-center",
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    closeButton: false,
  });
};