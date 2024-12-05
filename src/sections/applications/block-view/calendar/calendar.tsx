import React, { useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import i18next from 'i18next';
import { DataQuery, QueryResult } from 'src/types/queries-interface';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import CalendarStyleWrapper from './style-wrapper';

interface Props {
  blockInfo: any;
  handleGetHandlers: (props: { additionalFilters?: any[]; page?: number }) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  };
}

export default function CalendarView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = React.useState<any>({ ...data });

  const handleGetDocuments = useCallback(async () => {
    const { queriesResponse } = (await handleGetHandlers({})) || {};
    const dispatchData = dispatchFetchedData({
      dataQueries: queriesResponse,
      dispatchQueries: blockInfo.queries_dispatch,
      finalData,
    });

    setFinalData(dispatchData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockInfo.queries_dispatch, handleGetHandlers]);

  useEffect(() => {
    handleGetDocuments();
  }, [handleGetDocuments]);

  return (
    <Box>
      <Typography variant="h6" sx={{ height: '28px', mb: 1 }}>
        {data.card_title}
      </Typography>
      <CalendarStyleWrapper>
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
      </CalendarStyleWrapper>
    </Box>
  );
}
