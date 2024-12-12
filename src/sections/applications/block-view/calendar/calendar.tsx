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
import { useBoolean } from 'src/hooks/use-boolean';
import { EventClickArg } from '@fullcalendar/core';
import CalendarStyleWrapper from './style-wrapper';
import EventModal from './modal';

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
  const [eventInfoForModal, setEventInfoForModal] = React.useState<any>({});

  const eventModal = useBoolean();

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

  const handleEventClick = (e: EventClickArg) => {
    const findEv = documents.filter((f) => f._id.$oid === e.event.id);
    if (findEv) {
      setEventInfoForModal(findEv[0]);
      eventModal.onTrue();
    }
    return null;
  };

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ height: '28px', mb: 1 }}>
          {data.card_title}
        </Typography>
        <CalendarStyleWrapper>
          <FullCalendar
            editable
            selectable
            handleWindowResize
            locale={i18next.language === 'fr' ? frLocale : enLocale}
            locales={[enLocale, frLocale]}
            plugins={[dayGridPlugin, interactionPlugin]}
            themeSystem="mui"
            headerToolbar={{
              left: 'prev next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            events={eventList}
            eventClick={handleEventClick}
          />
        </CalendarStyleWrapper>
      </Box>

      <EventModal
        eventInfo={eventInfoForModal}
        open={eventModal.value}
        onClose={eventModal.onFalse}
      />
    </>
  );
}
