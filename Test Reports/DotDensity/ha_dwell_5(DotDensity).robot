*** Settings ***
Documentation     This is some basic info about the whole suite
Library           Selenium2Library

*** Variables ***

*** Test Cases ***
Open chrome in CORS
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${options}    add_argument    disable-web-security
    Call Method    ${options}    add_argument    allow-running-insecure-content
    Create WebDriver    Chrome    chrome_options=${options}
    Go To    file:///C:/Users/Boikanyo/Documents/Academics/3rd%20Year/Semester%202/COS%20301/Assignments/Capstone%20project/CGIS/Demo%202/Source/CGIS-Integrated-non-DP/proto-SideMenu.html
    #Enter user details
    #    Input Text    id=usr    user1
    #    Input Password    password    1234
    #    Submit Form

Open side menu
    sleep    1s
    Click Button    menubutton

Select map variable
    wait until element is visible    xpath=//select[@id="dataset"]
    click element    xpath=//select[@id="dataset"]
    wait until element is visible    xpath=//option[contains(text(),'Household Dataset')]
    sleep    1s
    click element    xpath=//option[contains(text(),'Household Dataset')]
    click element    xpath=//select[@id="dataset"]
    sleep    1s
    Select Checkbox    ha_dwell_5
    #Select map type
    #click element    xpath=//select/option[1]

Select map type
    sleep    1s
    click Button    b1

Close side menu
    sleep    2s
    Click Link    id=close_btn

Open map key
    sleep    3s
    Click Link    id=collapse_legend
