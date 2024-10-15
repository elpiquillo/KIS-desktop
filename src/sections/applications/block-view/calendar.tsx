import React from 'react';
import { alpha, Box, Typography, useTheme } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import styled from '@emotion/styled';
import i18next from 'i18next';

interface Props {
  blockInfo: any;
}

export default function CalendarView({ blockInfo }: Props) {
  const theme = useTheme();
  const { data } = blockInfo.blocs[0];

  const StyleWrapper = styled.div`
    .fc button {
      background: ${theme.palette.background.paper};
      border: 1px solid ${theme.palette.divider};
      border-radius: 8px;
      span {
        color: ${theme.palette.text.secondary};
      }
    }
    .fc button:hover {
      background: ${theme.palette.background.neutral};
      border-radius: 8px;
      color: ${theme.palette.text.primary};
      span {
        color: ${theme.palette.text.primary};
      }
    }
    .fc button:active {
      background: ${theme.palette.background.neutral};
      border-radius: 8px;
      span {
        color: ${theme.palette.text.primary};
      }
    }
    .fc-button-primary {
      background: ${theme.palette.background.paper};
      border: 1px solid ${theme.palette.divider};
      border-radius: 8px;
      color: ${theme.palette.text.primary};
      font-size: 14px;
      font-weight: 700;
    }
    .fc-button-primary:disabled {
      cursor: auto;
      background: ${theme.palette.background.paper};
      border: 1px solid ${theme.palette.divider};
      color: ${theme.palette.text.secondary};
    }
    .fc-button-primary:not(:disabled):active {
      box-shadow: none;
      background: ${theme.palette.background.neutral};
      border-radius: 8px;
      color: ${theme.palette.text.primary};
      span {
        color: ${theme.palette.text.primary};
      }
    }
    .fc-button-primary:focus,
    .fc-button-primary:not(:disabled):active:focus {
      box-shadow: none;
    }
    .fc-toolbar-title {
      font-size: 18px;
    }
    .fc-button-group {
      padding: 4px;
      gap: 4px;
      border: 1px solid ${theme.palette.divider};
      border-radius: 8px;
      color: ${theme.palette.text.secondary};
      span {
        color: ${theme.palette.text.primary};
      }
    }
    .fc-button-primary:not(:disabled).fc-button-active:focus {
      box-shadow: none;
    }
    .fc-direction-ltr .fc-button-group > .fc-button {
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: ${theme.palette.text.secondary};
    }
    .fc-button-primary:not(:disabled).fc-button-active {
      background: ${alpha(theme.palette.success.dark, 0.08)};
      color: ${theme.palette.success.main};
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    }
    .fc-col-header-cell-cushion {
      color: ${theme.palette.text.secondary};
    }
    .fc-daygrid-day-number {
      color: ${theme.palette.text.primary};
    }
    .fc-theme-standard th {
      border: 1px solid ${theme.palette.divider};
    }
    .fc-theme-standard td {
      border: 1px solid ${theme.palette.divider};
    }
    .fc-scrollgrid {
      border: 1px solid ${theme.palette.divider};
    }
  `;

  return (
    <Box>
      <Typography variant="h6" sx={{ height: '28px', mb: 1 }}>
        {data.card_title}
      </Typography>
      <StyleWrapper>
        <FullCalendar
          locale={i18next.language === 'fr' ? frLocale : enLocale}
          locales={[enLocale, frLocale]}
          plugins={[dayGridPlugin, interactionPlugin]}
          handleWindowResize
          themeSystem="mui"
          headerToolbar={{
            left: 'prev next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          editable
          selectable
        />
      </StyleWrapper>
    </Box>
  );
}
