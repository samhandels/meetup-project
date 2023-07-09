import { useHistory } from "react-router-dom";

export const GroupIndividualEvents = ({ events }) => {
  const upcomingEvent = [];
  const pastEvent = [];
  const time = new Date();
  const history = useHistory();

  for (let event of events) {
    if (event.previewImage === undefined) {
      event.previewImage = "unavailable";
    }
    if (new Date(event.startDate) > time) {
      upcomingEvent.push(event);
    } else {
      pastEvent.push(event);
    }
  }

  upcomingEvent.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  pastEvent.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const navigateToEvent = (eventId) => {
    history.push(`/events/${eventId}`);
  };

  return (
    <>
      
    </>
  );
};
