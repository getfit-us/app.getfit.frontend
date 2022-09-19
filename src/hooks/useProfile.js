import {useContext} from 'react';
import ProfileContext from '../context/ProfileProvider';

const useProfile = () => {
    return useContext(ProfileContext);
}

export default useProfile;