import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelopeOpen, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";  
const usePasswordToggle = () => {
  const [visible, setVisibility] = useState(false);

  const Icon = (
    <FontAwesomeIcon
      icon={visible ? faEyeSlash : faEye}
      onClick={() => setVisibility((vis) => !vis)}
      style={{ cursor: 'pointer', marginLeft: '10px' }}
    />
  );

  const InputType = visible ? 'text' : 'password';

  return [InputType, Icon];
};

export default usePasswordToggle;
