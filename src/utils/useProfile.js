import {useContext} from 'react';
import ProfileContext from '../context/ProfileContext';

const useProfile = () => {
    return useContext(ProfileContext);
}

export default useProfile;