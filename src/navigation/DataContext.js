import React, {createContext, useContext, useState} from 'react';

const DataContext = createContext();

export function DataProvider({children}) {
  const [userData, setUserData] = useState({userName: '', pwd: ''});

  const updateUserData = newData => {
    setUserData(prevData => ({...prevData, ...newData}));
  };

  return (
    <DataContext.Provider value={{userData, updateUserData}}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
