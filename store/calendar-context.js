import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  fetchVows,
  storeVow,
  updateVow,
  deleteVow,
  storeProgression,
  fetchProgressions,
  updateProgression,
  deleteProgression
} from '../util/http';

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [vows, setVows] = useState([]);
  const [progressions, setProgressions] = useState({});

  useEffect(() => {
    async function loadVows() {
      const loadedVows = await fetchVows();
      setVows(loadedVows);
    }

    loadVows();
  }, []);

  const addVow = async (vow) => {
    const id = await storeVow(vow);
    setVows((currentVows) => [...currentVows, { ...vow, id }]);
  };
 
  const updateVowHandler = async (vowId, updatedVow) => {
    await updateVow(vowId, updatedVow);
    setVows((currentVows) =>
      currentVows.map((vow) => (vow.id === vowId ? updatedVow : vow))
    );
  };

  const deleteVowHandler = async (vowId) => {
    await deleteVow(vowId);
    setVows((currentVows) => currentVows.filter((vow) => vow.id !== vowId));
  };

  const addProgression = async (vowId, progression) => {
    const id = await storeProgression(vowId, progression);
    setProgressions((currentProgressions) => ({
      ...currentProgressions,
      [vowId]: [...(currentProgressions[vowId] || []), { ...progression, id }],
    }));
  };

  const loadProgressions = async (vowId) => {
    const loadedProgressions = await fetchProgressions(vowId);
    setProgressions((currentProgressions) => ({
      ...currentProgressions,
      [vowId]: loadedProgressions,
    }));
  };

  const completeProgression = async (vowId) => {
    setProgressions((currentProgressions) => {
      const vowProgressions = currentProgressions[vowId];
      if (vowProgressions && vowProgressions.length > 0) {
        const updatedProgressions = vowProgressions.slice(0, -1);
        const completedProgression = vowProgressions[vowProgressions.length - 1];
        completedProgression.completedDate = new Date().toISOString();
        updateProgression(vowId, completedProgression.id, completedProgression);
        return {
          ...currentProgressions,
          [vowId]: updatedProgressions,
          [`${vowId}_completed`]: [
            ...(currentProgressions[`${vowId}_completed`] || []),
            completedProgression,
          ],
        };
      }
      return currentProgressions;
    });
  };

  const undoCompletion = async (vowId) => {
    setProgressions((currentProgressions) => {
      const completedProgressions = currentProgressions[`${vowId}_completed`];
      if (completedProgressions && completedProgressions.length > 0) {
        const updatedCompleted = completedProgressions.slice(0, -1);
        const lastCompleted = completedProgressions[completedProgressions.length - 1];
        delete lastCompleted.completedDate;
        updateProgression(vowId, lastCompleted.id, lastCompleted);
        return {
          ...currentProgressions,
          [`${vowId}_completed`]: updatedCompleted,
          [vowId]: [...(currentProgressions[vowId] || []), lastCompleted],
        };
      }
      return currentProgressions;
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        vows,
        addVow,
        updateVow: updateVowHandler,
        deleteVow: deleteVowHandler,
        progressions,
        addProgression,
        loadProgressions,
        completeProgression,
        undoCompletion,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
