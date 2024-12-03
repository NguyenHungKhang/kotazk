import defprojectcover1 from '../assets/defprojectcover/defprojectcover1.png';
import defprojectcover2 from '../assets/defprojectcover/defprojectcover2.png';
import defprojectcover3 from '../assets/defprojectcover/defprojectcover3.png';

import defworkspacecover1 from '../assets/defworkspacecover/defworkspacecover1.png';
import defworkspacecover2 from '../assets/defworkspacecover/defworkspacecover2.png';
import defworkspacecover3 from '../assets/defworkspacecover/defworkspacecover3.png';


const defaultProjectCovers = [
    defprojectcover1,
    defprojectcover2,
    defprojectcover3
];

const defaultWorkspaceCovers = [
    defworkspacecover1,
    defworkspacecover2,
    defworkspacecover3
];


export function getProjectCover(id, cover) {
    if (cover) {
        return cover; // Return the provided avatar if not null
    }
    // Use the ID to determine a default avatar (deterministic randomization)
    const index = id % defaultProjectCovers.length;
    return defaultProjectCovers[index]; // Return one of the default avatars
}


export function getWorkspaceCover(id, cover) {
    if (cover) {
        return cover; // Return the provided avatar if not null
    }
    // Use the ID to determine a default avatar (deterministic randomization)
    const index = id % defaultWorkspaceCovers.length;
    return defaultWorkspaceCovers[index]; // Return one of the default avatars
}
