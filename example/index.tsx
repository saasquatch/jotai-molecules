import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { atom, useAtom } from 'jotai';

import { molecule, createScope, ScopeProvider, useMolecule } from '../.';

const CompanyScope = createScope<string>('example.com');

const CompanyMolecule = molecule((_, getScope) => {
  const company = getScope(CompanyScope);
  const companyNameAtom = atom(company.toUpperCase());
  return {
    company,
    companyNameAtom,
  };
});

const UserScope = createScope<string>('bob@example.com');

const UserMolecule = molecule((getMol, getScope) => {
  const userId = getScope(UserScope);
  const companyAtoms = getMol(CompanyMolecule);
  const userNameAtom = atom(userId + ' name');
  const userCountryAtom = atom(userId + ' country');
  const groupAtom = atom((get) => {
    return userId + ' in ' + get(companyAtoms.companyNameAtom);
  });
  return {
    userId,
    userCountryAtom,
    userNameAtom,
    groupAtom,
    company: companyAtoms.company,
  };
});

const App = () => (
  <ScopeProvider scope={UserScope} value={'sam@example.com'}>
    <UserComponent />
  </ScopeProvider>
);

const UserComponent = () => {
  const userAtoms = useMolecule(UserMolecule);
  const [userName, setUserName] = useAtom(userAtoms.userNameAtom);

  return (
    <div>
      Hi, my name is {userName} <br />
      <input
        type="text"
        value={userName}
        onInput={(e) => setUserName((e.target as HTMLInputElement).value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
