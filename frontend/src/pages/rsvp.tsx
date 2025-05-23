import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Stepper, { Step } from "../components/stepper";
import { MapPin, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../config/api";

export default function RSVPPage() {
  const [fullName, setFullName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [searchComplete, setSearchComplete] = React.useState(false);
  const [showStepper, setShowStepper] = React.useState(false);

  type UserData = {
    id: number;
    name: string;
    email?: string;
    plus_ones_allowed?: number;
  };
  type UserGroup = { name: string };
  type EventStatus = {
    id: number;
    name: string;
    registered: boolean;
    location?: string;
    event_time?: string;
    description?: string;
  };
  type GroupMember = { name: string; events: EventStatus[] };

  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [userGroups, setUserGroups] = React.useState<UserGroup[]>([]);
  const [events, setEvents] = React.useState<
    {
      id: number;
      name: string;
      location?: string;
      event_time?: string;
      description?: string;
    }[]
  >([]);
  const [groupMembers, setGroupMembers] = React.useState<GroupMember[]>([]);

  // State to track registration status during update
  const [updatedRegistrations, setUpdatedRegistrations] = React.useState<{
    [eventId: number]: { [memberName: string]: boolean };
  }>({});

  const [plusOnes, setPlusOnes] = React.useState<
    { id: number; name: string }[]
  >([]);
  const [plusOneInput, setPlusOneInput] = React.useState("");
  const [plusOnesAllowed, setPlusOnesAllowed] = React.useState(0);

  // Validate name has at least a first and last name
  const isValidName = (name: string) => {
    const nameParts = name.trim().split(" ");
    return (
      nameParts.length >= 2 &&
      nameParts[0].length > 0 &&
      nameParts[1].length > 0
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    // Clear any previous errors when the user starts typing again
    if (error) setError("");
  };

  // Format date time to be more readable aka dont need the seconds
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidName(fullName)) {
      setError("Please enter a first and last name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API.user, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();

      if (!data?.user) {
        throw new Error("Missing user data in response");
      }

      if (!data?.user?.id || isNaN(Number(data.user.id))) {
        throw new Error("Invalid or missing user ID in response");
      }

      // Set user data with type assertion and proper number conversion
      setUserData({
        id: Number(data.user.id),
        name: data.user.name,
        email: data.user.email,
        plus_ones_allowed: data.user.plus_ones_allowed,
      });

      setUserGroups(data.groups || []);

      if (data.groupMembers && data.user) {
        // Remove duplicates by name, and put the user first
        const seen = new Set();
        const sorted = [...data.groupMembers]
          .sort((a) => (a.name === data.user.name ? -1 : 1))
          .filter((member) => {
            if (seen.has(member.name)) return false;
            seen.add(member.name);
            return true;
          });
        setGroupMembers(sorted);
      } else {
        setGroupMembers(data.groupMembers || []);
      }

      // Extract events from the first group member (all members have the same event list)
      const eventsList =
        data.groupMembers?.[0]?.events?.map((e: EventStatus) => ({
          id: e.id,
          name: e.name,
          location: e.location,
          event_time: e.event_time,
          description: e.description,
        })) || [];
      setEvents(eventsList);

      // Initialize the updatedRegistrations state with current registration status
      const initialRegistrations: {
        [eventId: number]: { [memberName: string]: boolean };
      } = {};
      eventsList.forEach((event: { id: number; name: string }) => {
        initialRegistrations[event.id] = {};
        data.groupMembers.forEach((member: GroupMember) => {
          const eventStatus = member.events.find((e) => e.id === event.id);
          initialRegistrations[event.id][member.name] =
            eventStatus?.registered || false;
        });
      });
      setUpdatedRegistrations(initialRegistrations);

      // Hide the search form after successful submission
      setSearchComplete(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(
        "We had a problem finding someone with that name. Please try again."
      );
      // console.error("Error details:", {
      //   error: err,
      //   message: errorMessage,
      //   fullName,
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowUpdateStepper = () => {
    setShowStepper(true);
  };

  const handleCancelUpdate = () => {
    // Reset to original registration status and hide stepper
    setShowStepper(false);
  };

  const handleUpdateRegistration = async () => {
    try {
      const response = await fetch(API.update, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedRegistrations, plusOnes }),
      });
      if (!response.ok) throw new Error("Failed to update registrations");
    } catch (err) {
      //console.error("Error updating registrations:", err);
    }

    // Update local state to reflect new registrations
    const updatedMembers = groupMembers.map((member) => {
      const updatedMember = { ...member };
      updatedMember.events = updatedMember.events.map((event) => {
        return {
          ...event,
          registered: updatedRegistrations[event.id]?.[member.name] || false,
        };
      });
      return updatedMember;
    });

    setGroupMembers(updatedMembers);
    setShowStepper(false);
  };

  const setAttendance = (
    eventId: number,
    memberName: string,
    value: boolean
  ) => {
    setUpdatedRegistrations((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [memberName]: value,
      },
    }));
  };

  const renderAttendanceStatus = (isAttending: boolean) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isAttending ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isAttending ? "Attending" : "Not Attending"}
    </span>
  );

  // After fetching user data, set plusOnesAllowed
  React.useEffect(() => {
    if (userData && userData.plus_ones_allowed !== undefined) {
      setPlusOnesAllowed(userData.plus_ones_allowed);
    }
  }, [userData]);

  // Handler for plus one name change
  const handlePlusOneChange = (idx: number, value: string) => {
    setPlusOnes((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], name: value };
      return updated;
    });
  };

  // Add a plus one
  const handleAddPlusOne = async () => {
    if (!isValidName(plusOneInput) || !userData?.id) return;
    const res = await fetch(API.plusOne.add, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviterId: userData.id, fullName: plusOneInput }),
    });
    if (res.ok) {
      setPlusOneInput("");
      await fetchUserAndGroupInfo(); // Refresh group members and events
    } else {
      const errMsg = await res.json();
      alert(errMsg.message || "Failed to add plus one");
    }
  };

  // Remove a plus one
  const handleRemovePlusOne = async (plusOneId: number) => {
    if (!userData?.id) return;
    const res = await fetch(API.plusOne.remove, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviterId: userData.id, plusOneId }),
    });
    if (res.ok) {
      await fetchUserAndGroupInfo(); // Refresh group members and events
    } else {
      // handle error
    }
  };

  React.useEffect(() => {
    if (!userData?.id) return; // Early return if no user data

    const fetchPlusOnes = async () => {
      try {
        const response = await fetch(API.plusOne.list(userData.id), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch plus ones");
        }

        const data = await response.json();

        if (!Array.isArray(data.plusOnes)) {
          throw new Error("Invalid response format");
        }

        setPlusOnes(
          data.plusOnes.map((p: any) => ({
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
          }))
        );
      } catch (error) {
        //console.error("Error fetching plus ones:", error);
        setError("Unable to load plus ones. Please try again later.");
      }
    };

    fetchPlusOnes();
  }, [userData]);

  const fetchUserAndGroupInfo = React.useCallback(
    async (fullNameToFetch?: string) => {
      const name = fullNameToFetch || fullName;
      if (!name) return;

      try {
        const response = await fetch(API.user, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: name }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }

        const data = await response.json();

        if (!data?.user) throw new Error("Missing user data in response");
        if (!data?.user?.id || isNaN(Number(data.user.id)))
          throw new Error("Invalid or missing user ID in response");

        setUserData({
          id: Number(data.user.id),
          name: data.user.name,
          email: data.user.email,
          plus_ones_allowed: data.user.plus_ones_allowed,
        });

        setUserGroups(data.groups || []);

        if (data.groupMembers && data.user) {
          const seen = new Set();
          const sorted = [...data.groupMembers]
            .sort((a) => (a.name === data.user.name ? -1 : 1))
            .filter((member) => {
              if (seen.has(member.name)) return false;
              seen.add(member.name);
              return true;
            });
          setGroupMembers(sorted);
        } else {
          setGroupMembers(data.groupMembers || []);
        }

        const eventsList =
          data.groupMembers?.[0]?.events?.map((e: any) => ({
            id: e.id,
            name: e.name,
            location: e.location,
            event_time: e.event_time,
            description: e.description,
          })) || [];
        setEvents(eventsList);

        // Update registrations
        const initialRegistrations: {
          [eventId: number]: { [memberName: string]: boolean };
        } = {};
        eventsList.forEach((event: { id: number; name: string }) => {
          initialRegistrations[event.id] = {};
          data.groupMembers.forEach((member: any) => {
            const eventStatus = member.events.find(
              (e: any) => e.id === event.id
            );
            initialRegistrations[event.id][member.name] =
              eventStatus?.registered || false;
          });
        });
        setUpdatedRegistrations(initialRegistrations);
      } catch (err) {
        //console.error("Error refreshing group info:", err);
      }
    },
    [fullName]
  );

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start gap-6 py-8 md:py-10 px-4 md:px-6 w-full max-w-7xl mx-auto">
        {/* Plus Ones Section */}
        {plusOnesAllowed > 0 && userData && (
          <div className="mb-6 p-6 border rounded-lg shadow-md w-full max-w-md bg-white">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Add Your Plus One{plusOnesAllowed > 1 ? "s" : ""}
            </h3>
            <div className="text-sm text-gray-600 text-center mb-4">
              {plusOnesAllowed === 1
                ? "You may bring 1 guest."
                : `You may bring up to ${plusOnesAllowed} guests.`}
            </div>
            {plusOnes.length >= plusOnesAllowed && (
              <div className="text-xs text-red-500 mb-2 text-center">
                You have reached your plus one limit.
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              {plusOnes.length < plusOnesAllowed && (
                <form
                  className="flex items-center w-full gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isValidName(plusOneInput) && userData)
                      handleAddPlusOne();
                  }}
                >
                  <Input
                    label="Guest Name"
                    placeholder="Enter your plus one's full name"
                    value={plusOneInput}
                    onChange={(e) => setPlusOneInput(e.target.value)}
                    className="flex-1"
                  />
                  <AnimatePresence>
                    {isValidName(plusOneInput) && userData && (
                      <motion.div
                        key="add-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <Button
                          color="primary"
                          size="sm"
                          type="submit"
                          className="cursor-pointer bg-gray-500 hover:bg-gray-600"
                        >
                          Add
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              )}
            </div>
            <ul className="list-disc ml-6">
              {plusOnes.map((p) => (
                <li
                  key={p.id}
                  className="text-sm text-gray-800 flex items-center justify-between pr-2"
                >
                  <span>{p.name}</span>
                  <button
                    type="button"
                    className="ml-4 flex items-center justify-center p-1 hover:bg-gray-100 rounded"
                    onClick={() => handleRemovePlusOne(p.id)}
                    aria-label={`Remove ${p.name}`}
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!searchComplete && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md"
          >
            <Input
              label=""
              labelPlacement="outside"
              name="fullName"
              placeholder="Enter your full name"
              type="text"
              value={fullName}
              onChange={handleNameChange}
              isInvalid={!!error}
              errorMessage={error || "Please enter your first and last name"}
              className="w-full"
            />

            <div className="flex gap-2 mt-2">
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
                disabled={isLoading || !fullName.trim()}
                className="w-full cursor-pointer bg-gray-500 hover:bg-gray-600"
              >
                {isLoading ? "Loading..." : "Find your invitation"}
              </Button>
            </div>
          </form>
        )}

        {events.length > 0 && groupMembers.length > 0 && !showStepper && (
          <div className="mt-6 p-6 border rounded-lg shadow-md w-full max-w-md bg-white">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Event Registration Status
            </h3>

            <div className="space-y-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="font-semibold mb-2">{event.name}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {event.location && (
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin size={16} className="text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.event_time && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-gray-500" />
                        <span>{formatDateTime(event.event_time)}</span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <div className="text-sm text-gray-500 mb-3">
                      {event.description}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {groupMembers.map((member, idx) => {
                      const eventStatus = member.events.find(
                        (e) => e.id === event.id
                      );
                      return (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span>{member.name}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus?.registered ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {eventStatus?.registered
                              ? "Registered"
                              : "Not Registered"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                color="primary"
                className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                onClick={handleShowUpdateStepper}
              >
                Update Registration
              </Button>
            </div>
          </div>
        )}

        {showStepper && (
          <div className="w-full max-w-md">
            <Stepper
              initialStep={1}
              onFinalStepCompleted={handleUpdateRegistration}
              onCancel={handleCancelUpdate}
              backButtonText="Previous"
              nextButtonText="Next"
              cancelButtonText="Cancel"
              stepCircleContainerClassName="bg-white"
              contentClassName="bg-white"
              nextButtonProps={{
                className:
                  "duration-350 flex items-center justify-center rounded-md bg-gray-500 py-2 px-4 font-medium tracking-tight text-white transition hover:bg-gray-600 active:bg-gray-700",
              }}
              backButtonProps={{
                className:
                  "duration-350 rounded-md px-4 py-2 transition text-gray-600 border border-gray-300 hover:bg-gray-50",
              }}
              cancelButtonProps={{
                className:
                  "duration-350 rounded-md px-4 py-2 transition text-gray-600 border border-gray-300 hover:bg-gray-50",
              }}
            >
              {events.map((event) => (
                <Step key={event.id}>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-center">
                      {event.name}
                    </h2>
                    <div className="flex flex-col gap-1 items-center mb-3">
                      {event.location && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.event_time && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar size={16} />
                          <span>{formatDateTime(event.event_time)}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <div className="text-sm text-gray-500 mb-4 text-center">
                        {event.description}
                      </div>
                    )}
                    <p className="text-gray-600 mb-6 text-center">
                      Please confirm who will be attending this event
                    </p>

                    <div className="space-y-4">
                      {groupMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 "
                        >
                          <span className="font-medium pl-3">
                            {member.name}
                          </span>
                          <div className="flex gap-3">
                            <Button
                              color={
                                updatedRegistrations[event.id]?.[member.name]
                                  ? "success"
                                  : "default"
                              }
                              variant="solid"
                              size="sm"
                              onClick={() =>
                                setAttendance(event.id, member.name, true)
                              }
                              className={`px-3 py-1 ${updatedRegistrations[event.id]?.[member.name] ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                              Accept
                            </Button>
                            <Button
                              color={
                                !updatedRegistrations[event.id]?.[member.name]
                                  ? "danger"
                                  : "default"
                              }
                              variant="solid"
                              size="sm"
                              onClick={() =>
                                setAttendance(event.id, member.name, false)
                              }
                              className={`px-3 py-1 ${!updatedRegistrations[event.id]?.[member.name] ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Step>
              ))}
              <Step>
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Confirm Your Responses
                  </h2>
                  <p className="text-gray-600 mb-6 text-center">
                    Please review your attendance selections
                  </p>

                  <div className="space-y-6">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="pb-4 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="font-semibold mb-2 pl-5">
                          {event.name}
                        </div>
                        <div className="flex flex-col gap-1 mb-3 pl-5">
                          {event.location && (
                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                              <MapPin size={14} />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.event_time && (
                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                              <Calendar size={14} />
                              <span>{formatDateTime(event.event_time)}</span>
                            </div>
                          )}
                        </div>
                        <ul className="space-y-2">
                          {groupMembers.map((member, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between items-center"
                            >
                              <span className="pl-5">{member.name}</span>
                              <span className="pr-5">
                                {renderAttendanceStatus(
                                  updatedRegistrations[event.id]?.[
                                    member.name
                                  ] || false
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-600 mt-6 text-center">
                    Click "Complete" to save your responses
                  </p>
                </div>
              </Step>
            </Stepper>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
