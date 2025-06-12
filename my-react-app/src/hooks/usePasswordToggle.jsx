import React, { useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
