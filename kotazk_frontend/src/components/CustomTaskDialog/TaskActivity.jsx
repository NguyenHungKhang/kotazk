import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
import { useState } from "react";
import * as TablerIcons from '@tabler/icons-react'

const TaskActivity = ({ activityLogs }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const ExpandIcon = TablerIcons["IconChevronDown"]

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      sx={{
        boxShadow: 'none',
        borderRadius: 2,
        border: '1px solid',
        borderColor: getCustomTwoModeColor(theme, theme.palette.grey[300], theme.palette.grey[800])
      }}
      expanded={expanded}
      onChange={() => handleChange()}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon size={18} />}
        id="panel1-header"
      >
        <Typography textAlign={'center'} fontWeight={650}
          sx={{
            "&:hover": {
              textDecoration: 'underline'
            }
          }}
          width={"100%"}
        >
          {expanded ? "Hide task activities" : "Show task activities"}
        </Typography>

      </AccordionSummary>
      <AccordionDetails
        sx={{
          bgcolor: getSecondBackgroundColor(theme)
        }}
      >
        <Stack spacing={1} my={2}>
          {activityLogs?.map((activityLog) => (
            <Stack direction={'row'} spacing={2} key={activityLog.id}>
              <Box flexGrow={1}>
                <Typography key={activityLog.id}>
                  {activityLog.userText + " " + activityLog.content}
                </Typography>
              </Box>
              <Box>
                {dayjs(activityLog.createdAt).format("HH:mm MM/DD/YYYY")}
              </Box>
            </Stack>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
export default TaskActivity;