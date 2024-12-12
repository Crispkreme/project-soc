import React, { lazy, Suspense } from 'react';

const Tabs = lazy(() => import("@/Components/Links/Tabs"));
const UserDetail = lazy(() => import("@/Components/Cards/UserDetail"));
const PatientLayout = lazy(() => import("@/Layouts/PatientLayout"));

const Practitioner = ({ totalBhw, totalPatient, totalPractitioner, practitioners, bhws }) => {
  console.log("practitioners", practitioners);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientLayout>
        <Tabs tabTitles={[`Patient ${totalPatient}`, `Practitioner ${totalPractitioner}`, `Bhw ${totalBhw}`]}>
          <div>
            <h2></h2>
            <p></p>
          </div>
          <div>
            <h2>List of Practitioner</h2>
            {practitioners.length > 0 ? (
              <div style={styles.cardContainer}>
                {practitioners.map((practitioner) => (
                  <UserDetail
                    key={practitioner.id}
                    userDetail={{
                      role: practitioner.role,
                      profile: practitioner.profile || "https://cdn-icons-png.freepik.com/512/700/700674.png",
                      name: practitioner.name,
                      address: practitioner.address || "No Address Provided",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div>No Available Practitioner</div>
            )}
          </div>
          <div>
            <h2>List of Bhw</h2>
            {bhws.length > 0 ? (
              <div style={styles.cardContainer}>
                {bhws.map((bhw) => (
                  <UserDetail
                    key={bhw.id}
                    userDetail={{
                      role: bhw.role,
                      profile: bhw.profile || "https://cdn-icons-png.freepik.com/512/700/700674.png",
                      firstname: bhw.firstname,
                      middlename: bhw.middlename,
                      lastname: bhw.lastname,
                      address: bhw.address || "No Address Provided",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div>No Available Bhw</div>
            )}
          </div>
        </Tabs>
      </PatientLayout>
    </Suspense>
  );
};

const styles = {
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    padding: '16px',
  },
};

export default Practitioner;
