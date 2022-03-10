use std::{
    fs::File,
    process::{Command, Stdio},
};

use serde::{Deserialize, Serialize};
use structopt::StructOpt;

#[derive(StructOpt)]
#[structopt(about = "the stupid content tracker")]
enum Opt {
    CreateStats,
}
#[derive(Debug, Deserialize)]
struct SyncthingSystem {
    #[serde(rename = "myID")]
    my_id: String,
}

#[derive(Debug, Deserialize)]
struct Start9Config {
    username: String,
    password: String,
}

#[derive(Debug, Serialize)]
struct Stats {
    data: StatsData,
    version: u64,
}

#[derive(Debug, Serialize, Clone)]
struct StatsData {
    #[serde(rename = "Device ID")]
    id: StatsDataType,
    #[serde(rename = "Username")]
    username: StatsDataType,
    #[serde(rename = "Password")]
    password: StatsDataType,
}

#[derive(Debug, Serialize, Clone)]
struct StatsDataType {
    #[serde(rename = "type")]
    value_type: String,
    value: String,
    description: String,
    copyable: bool,
    qr: bool,
    masked: bool,
}
fn main() {
    let opt = Opt::from_args();

    match opt {
        Opt::CreateStats => create_stats(),
    }
}

fn create_stats() {
    let child = Command::new("syncthing")
        .args(&["cli", "show", "system"])
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();
    let start9_config_file = File::open("/root/start9/config.yaml").unwrap();

    let syncthing_system: SyncthingSystem = serde_json::from_reader(child.stdout.unwrap()).unwrap();
    let Start9Config { username, password } = serde_yaml::from_reader(start9_config_file).unwrap();

    let stats = Stats {
        version: 2,
        data: StatsData {
            id: StatsDataType {
                value_type: "string".to_string(),
                value: syncthing_system.my_id,
                description: "his is the ID for syncthing to attach others to".to_string(),
                copyable: true,
                qr: true,
                masked: false,
            },
            username: StatsDataType {
                value_type: "string".to_string(),
                value: username,
                description: "Username to login to the UI".to_string(),
                copyable: true,
                qr: false,
                masked: false,
            },
            password: StatsDataType {
                value_type: "string".to_string(),
                value: password,
                description: "Password to login to the UI".to_string(),
                copyable: true,
                qr: false,
                masked: true,
            },
        },
    };

    let file = File::create("/root/start9/stats.yaml").unwrap();
    serde_yaml::to_writer(file, &stats).unwrap();
}
