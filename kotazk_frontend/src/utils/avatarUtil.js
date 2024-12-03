import defavt1 from '../assets/defavt/defavt1.png';
import defavt2 from '../assets/defavt/defavt2.png';
import defavt3 from '../assets/defavt/defavt3.png';
import defavt4 from '../assets/defavt/defavt4.png';

const defaultAvatars = [
    defavt1,
    defavt2,
    defavt3,
    defavt4,
];

export function getAvatar(id, avatar) {
    if (avatar) {
        return avatar; // Return the provided avatar if not null
    }
    // Use the ID to determine a default avatar (deterministic randomization)
    const index = id % defaultAvatars.length;
    return defaultAvatars[index]; // Return one of the default avatars
}
