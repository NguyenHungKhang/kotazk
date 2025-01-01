import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { Box, Button, Select, MenuItem, InputLabel, FormControl, Checkbox, FormGroup, FormControlLabel, Card, Typography, Divider } from '@mui/material';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

const filter = createFilterOptions();

export default function AddWorkspaceMember() {
    const [value, setValue] = React.useState([]);
    const [members, setMembers] = React.useState([]);
    const [selectedMemberRole, setSelectedMemberRole] = React.useState(null);
    const [memberRoles, setMemberRoles] = React.useState([]);
    const [isOverideRole, setIsOverideRole] = React.useState(true);
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [inviting, setInviting] = React.useState(false);

    const handleIsOverideRole = (event) => {
        setIsOverideRole(event.target.checked);
    };

    React.useEffect(() => {
        if (workspace) {
            fetchWorkspaceMemberRole();
        }
    }, [workspace]);

    const fetchWorkspaceMemberRole = async () => {
        try {

            const data = {
                "filters": [
                    {
                        "key": "roleFor",
                        "operation": "EQUAL",
                        "value": "WORK_SPACE"
                    }
                ]
            }

            const response = await apiService.memberRoleAPI.getPageByWorkspace(workspace.id, data)
            if (response?.data) {
                setMemberRoles(response?.data?.content);
                setSelectedMemberRole(response?.data.content.find(r => r.name == "Editor" && r.systemInitial == true)?.id);
            }

        } catch (e) {
            console.log(e);
        }
    }

    const getAvatarText = (lastName) => {
        return lastName?.charAt(0).toUpperCase() || '?';
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && !email.includes(' '); // Ensure no spaces
    };

    const isDuplicate = (email) => {
        return value.some((item) => item.email.toLowerCase() === email.toLowerCase());
    };

    const processEmail = (email) => {
        let processedEmail = email;
        if (!isValidEmail(email) && !email.includes('@')) {
            processedEmail = `${email}@gmail.com`;
        }
        return processedEmail;
    };

    const handleRoleChange = (event) => {
        setSelectedMemberRole(event.target.value)
    };

    const handleSave = async () => {
        try {
            setInviting(true)
            const data = {
                workspaceId: workspace.id,
                memberRoleId: selectedMemberRole,
                items: value
            };

            const response = await apiService.memberAPI.inviteList(data);
            if (response?.data) {
                alert("OK")
            }
            setInviting(false)
        } catch (e) {
            alert(e);
        }
    }

    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Box p={4}>
                <Typography fontWeight={650} variant='h6'>
                    Invite with email
                </Typography>
                <Stack direction={'row'} spacing={2} alignItems="center" width={'100%'}>
                    <Box flexGrow={1}>
                        <Autocomplete
                            multiple
                            value={value}
                            fullWidth
                            onChange={(event, newValue) => {
                                const lastValue = newValue[newValue.length - 1];

                                if (typeof lastValue === 'string') {
                                    let processedEmail = processEmail(lastValue);
                                    if (isValidEmail(processedEmail) && !isDuplicate(processedEmail)) {
                                        setValue([
                                            ...newValue.slice(0, -1),
                                            { email: processedEmail, firstName: null, lastName: null, id: null, avatar: null },
                                        ]);
                                    }
                                } else if (lastValue?.inputValue) {
                                    let processedEmail = processEmail(lastValue.inputValue);
                                    if (isValidEmail(processedEmail) && !isDuplicate(processedEmail)) {
                                        setValue([
                                            ...newValue.slice(0, -1),
                                            { email: processedEmail, firstName: null, lastName: null, id: null, avatar: null },
                                        ]);
                                    }
                                } else {
                                    setValue(newValue);
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;

                                if (inputValue !== '' && !options.some((option) => option.email === inputValue) && !isDuplicate(inputValue)) {
                                    let processedEmail = processEmail(inputValue);
                                    filtered.push({
                                        inputValue: processedEmail,
                                        email: processedEmail,
                                        firstName: null,
                                        lastName: null,
                                        id: null,
                                        avatar: null,
                                    });
                                }

                                return filtered;
                            }}
                            size='small'
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id="free-solo-multiple-demo"
                            options={members}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                return `${option.firstName} ${option.lastName} (${option.email})`;
                            }}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;

                                return (
                                    <li key={key} {...optionProps}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {option.id &&
                                                <Avatar
                                                    src={option.avatar}
                                                    sx={{
                                                        height: 30,
                                                        width: 30,
                                                    }}
                                                >
                                                    {!option.avatar && getAvatarText(option.lastName)}
                                                </Avatar>}
                                            {option.id ?
                                                <span>
                                                    {option.firstName} {option.lastName} - {option.email}
                                                </span>
                                                :
                                                <Typography color='info'>
                                                    Add new email: {option.email}
                                                </Typography>
                                            }
                                        </Stack>
                                    </li>
                                );
                            }}
                            freeSolo
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip
                                        key={option.email}
                                        label={option.firstName && option.lastName ? `${option.firstName} ${option.lastName}` : option.email}
                                        avatar={option.id ?
                                            <Avatar src={option.avatar}>
                                                {!option.avatar && getAvatarText(option.lastName)}
                                            </Avatar> : null
                                        }
                                        {...getTagProps({ index })}
                                        sx={{
                                            borderRadius: 1,  // Change borderRadius here
                                        }}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Enter email" size='small' fullWidth />
                            )}
                        />
                    </Box>
                    {/* Role Members Selector */}
                    <Box>
                        <Select
                            size="small"
                            value={selectedMemberRole}
                            onChange={handleRoleChange}
                        >
                            {memberRoles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Invite Button */}
                    <Box>
                        <LoadingButton variant='contained' onClick={() => handleSave()} loading={inviting} disabled={value?.length == 0}>
                            Invite
                        </LoadingButton>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
