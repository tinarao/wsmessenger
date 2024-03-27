const NotificationBubble = ({ number }: { number: number }) => {
  return (
    <p className="size-6 p-0 flex font-bold justify-center items-center bg-neutral-700 text-white text-center rounded-full ml-auto">
      {number}
    </p>
  );
};

export default NotificationBubble;
