import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { Box, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const filter = createFilterOptions();

export default function EmailChipInput({ currentMembers, currentRoleMembers }) {
  const [value, setValue] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [selectedMemberRole, setSelectedMemberRole] = React.useState(null);
  const [memberRoles, setMemberRoles] = React.useState([]);

  React.useEffect(() => {
    if (currentMembers) {
      setMembers(currentMembers.map((m) => ({
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        email: m.user.email,
        id: m.id,
        avatar: m.user.avatar
      })));
    }
  }, [currentMembers]);

  React.useEffect(() => {
    if (currentRoleMembers) {
      setMemberRoles(currentRoleMembers);
      setSelectedMemberRole(currentRoleMembers.find(r => r.name == "Editor" && r.systemInitial == true)?.id);
    }
  }, [currentRoleMembers]);

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

  return (
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
                  <Avatar
                    src={option.avatar}
                    sx={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    {!option.avatar && getAvatarText(option.lastName)}
                  </Avatar>
                  <span>
                    {option.firstName} {option.lastName} - {option.email}
                  </span>
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
        <Button variant='contained' onClick={() => console.log(value)}>
          Invite
        </Button>
      </Box>
    </Stack>
  );
}
