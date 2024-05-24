# cardiac-tracker

## Installation & execution

Install npm
```
install -g npm@9.7.1
```
### Mobile app
Change  java version to jdk 11
```shell
sudo update-alternatives --config java
```
Accept usb connection on android device
```shell
adb devices
```
Install react native app
```shell
npx react-native@latest init AwesomeProject --npm
```
Go into the project directory and install bluetooth low energy manager package
```shell
npm i --save react-native-ble-manager
```
Install and update gradle to last version (optionnal)
```shell
sudo apt install gradle
sudo add-apt-repository ppa:cwchien/gradle
sudo apt-get update
sudo apt upgrade gradle
```
Start metro
```shell
npm start
```
In new terminal start application
```shell
npm run android
```
Increase  # if watch files
```shell
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
### Front-end
```shell

npx create-react-app my-app
cd my-frontend
npm install reactstrap react react-dom
npm install --save bootstrap
npm start
```
### Back-end
Running locally using Spring Boot
```shell
mvn clean package spring-boot:repackage -Pboot -DskipTests && java -jar target/ROOT.war
```
Server @ http://localhost:8080/ and eg. http://localhost:8080/fhir/metadata. Remember to adjust you overlay configuration in the application.yaml to eg.
```yaml
    tester:
      -
          id: home
          name: Local Tester
          server_address: 'http://localhost:8080/fhir'
          refuse_to_fetch_third_party_urls: false
          fhir_version: R4
```
#### database
- Connection to postgres
```sh
sudo -u postgres psql
```

- Grant accesses
```sh
GRANT ALL PRIVILEGES ON DATABASE "scratch_fhir" to admin;
GRANT ALL PRIVILEGES ON DATABASE "scratch_fhir" to postgres;
```
- Tables:
```sql
CREATE TABLE Patients (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(10)
);
CREATE TABLE Observation (
  id SERIAL PRIMARY KEY,
  patient_id INT,
  status VARCHAR(20),
  category VARCHAR(50),
  code_system VARCHAR(100),
  code_code VARCHAR(50),
  code_display VARCHAR(200),
  value_quantity FLOAT,
  value_unit VARCHAR(50),
  interpretation VARCHAR(50),
  reference_range_low FLOAT,
  reference_range_high FLOAT,
  effective_datetime TIMESTAMP,
  CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES Patients(id)
);
```

Cloud

ssh david@cardioremote.westeurope.cloudapp.azure.com

scp -r ./spring-backend:v1.0.tar david@cardioremote.westeurope.cloudapp.azure.com:/home/david

