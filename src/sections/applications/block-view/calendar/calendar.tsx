import { DatesSetArg, EventChangeArg, EventClickArg } from '@fullcalendar/core';
import enLocale from '@fullcalendar/core/locales/en-gb';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { Box, Typography } from '@mui/material';
import i18next, { t } from 'i18next';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useUpdateDataHandlers } from 'src/apis/data-handler';
import { useBoolean } from 'src/hooks/use-boolean';
import { refreshDataLink } from 'src/hooks/use-data-link';
import { useParams } from 'src/routes/hooks';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { CalendarData } from 'src/types/application/calendar-interface';
import { BlockInterface } from 'src/types/application/general-interface';
import { CustomFilter, DataQuery, Document, QueryResult } from 'src/types/queries-interface';
import EventModal from './modal';
import CalendarStyleWrapper from './style-wrapper';

interface Props {
  blockInfo: BlockInterface<CalendarData>;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function CalendarView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = useState<CalendarData>({ ...data });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [eventInfoForModal, setEventInfoForModal] = useState<Document | null>(null);
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);

  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());

  const eventModal = useBoolean();
  const { pageId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { updateDataHandlers } = useUpdateDataHandlers(data.queries?.[0]);

  const handleGetDocuments = useCallback(async () => {
    const { queriesResponse: response } = (await handleGetHandlers({})) || {};

    setFinalData((prevFinalData) =>
      dispatchFetchedData({
        dataQueries: response,
        dispatchQueries: data.queries_dispatch,
        finalData: prevFinalData,
      })
    );
    setDocuments(response[0].documents);
    setQueriesResponse(response || []);
  }, [data.queries_dispatch, handleGetHandlers]);

  const getNameFieldFromQueriesDispatch = useCallback(
    (string: string) => {
      const find = data.queries_dispatch?.[0].destination_fields.find(
        (qd) => Object.keys(qd)[0] === string
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

  const handleEventChange = async (e: EventChangeArg) => {
    const {
      event: { startStr, endStr, id },
    } = e;

    const eventForUpdating = documents.find((f) => f._id.$oid === id);

    try {
      if (eventForUpdating) {
        const copyEvent = JSON.parse(JSON.stringify(eventForUpdating));

        copyEvent[getNameFieldFromQueriesDispatch('event_start') as string] = startStr;
        copyEvent[getNameFieldFromQueriesDispatch('event_end') as string] = endStr || startStr;

        const res = await updateDataHandlers({ pageId: pageId || '1', documents: [copyEvent] });
        const {
          updated: [updatedDocument],
        } = res;

        const copyDocuments = [...documents];
        const qIndex = documents.findIndex((tq) => tq._id.$oid === updatedDocument._id.$oid);
        copyDocuments[qIndex] = updatedDocument;

        setDocuments(copyDocuments);
        refreshDataLink(data.queries[0].collection_name, id);
      }

      enqueueSnackbar(t('applications.calendar.editSuccess'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } catch (err) {
      enqueueSnackbar(t('applications.somethingWentWrong'), {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  };

  const handleEventClick = (e: EventClickArg) => {
    const findEv = documents.filter((f) => f._id.$oid === e.event.id)?.[0];
    if (findEv) {
      if (data.queries_dispatch?.length && queriesResponse?.length) {
        const current_queries = JSON.parse(JSON.stringify(queriesResponse));
        current_queries[0].documents = [findEv || {}];

        const dispatchData = dispatchFetchedData({
          dataQueries: current_queries,
          dispatchQueries: data.queries_dispatch,
          finalData,
        });
        findEv.eventContent = dispatchData.event_content;
      }
      setEventInfoForModal(findEv);
      eventModal.onTrue();
    }
    return null;
  };

  const handleViewChange = (info: DatesSetArg) => {
    setCurrentView(info.view.type);
    const { currentStart } = info.view;
    if (
      currentDate.getDate() !== currentStart.getDate() ||
      currentDate.getMonth() !== currentStart.getMonth() ||
      currentDate.getFullYear() !== currentStart.getFullYear()
    ) {
      setCurrentDate(info.view.currentStart);
    }
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
            initialView={currentView}
            initialDate={currentDate}
            events={eventList}
            eventChange={handleEventChange}
            eventClick={handleEventClick}
            datesSet={handleViewChange}
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
