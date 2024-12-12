import React, { useCallback, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import i18next from 'i18next';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import CalendarStyleWrapper from './style-wrapper';

interface Props {
  blockInfo: any;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  };
}

export default function CalendarView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = React.useState<any>({ ...data });
  const [documents, setDocuments] = React.useState<any[]>([]);

  const handleGetDocuments = useCallback(async () => {
    const { queriesResponse } = (await handleGetHandlers({})) || {};
    const dispatchData = dispatchFetchedData({
      dataQueries: queriesResponse,
      dispatchQueries: blockInfo.queries_dispatch,
      finalData,
    });

    setFinalData(dispatchData);
    setDocuments(queriesResponse[0].documents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockInfo.queries_dispatch, handleGetHandlers]);

  const getNameFieldFromQueriesDispatch = useCallback(
    (string: string) => {
      const find = data.queries_dispatch?.[0].destination_fields.find(
        (qd: any) => Object.keys(qd)[0] === string
      );
      if (find) {
        return Object.values(find)[0] as string;
      }
      return '';
    },
    [data.queries_dispatch]
  );

  const eventList = useMemo(
    () =>
      documents.map((f_d) => ({
        title: f_d[getNameFieldFromQueriesDispatch('event_preview')],
        start: f_d[getNameFieldFromQueriesDispatch('event_start')],
        end: f_d[getNameFieldFromQueriesDispatch('event_end')],
        id: f_d._id.$oid,
      })),
    [documents, getNameFieldFromQueriesDispatch]
  );

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
          events={eventList}
          editable
          selectable
        />
      </CalendarStyleWrapper>
    </Box>
  );
}
