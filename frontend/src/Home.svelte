<script>
  import { onMount } from "svelte"
  import { formatDateTime, getDefaultHeaders } from "./utils.js"
  let logStashes = []
  let devices = []
  onMount(async () => {
    await getDevices()
    await refreshLogStashes()
    setInterval(async () => await refreshLogStashes(), 1000)
  })

  function hostName(ip) {
    return devices.filter((d) => d.ip == ip)[0]?.name ?? ip
  }
  export async function refreshLogStashes() {
    logStashes = await fetch("http://localhost:8765/api/v1/logStash", {
      headers: getDefaultHeaders(),
    })
      .then((r) => r.json())
      .then((ls) =>
        ls.map((l) => {
          l.src_ip = hostName(l.src_ip)
          l.dst_ip = hostName(l.dst_ip)
          return l
        })
      )
  }

  async function getDevices() {
    devices = await fetch("http://localhost:8765/api/v1/devices", {
      headers: getDefaultHeaders(),
    }).then((r) => r.json())
  }
</script>

{#if devices.length > 0}
  <table class="table table-striped">
    <thead>
      <tr>
        <td>Device Name</td>
        <td>IP address</td>
      </tr>
    </thead>
    <tbody>
      {#each devices as device}
        <tr>
          <td>{device.name}</td>
          <td>{device.ip}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

{#if logStashes.length > 0}
  <table class="table table-striped">
    <thead>
      <tr>
        <td>Time</td>
        <td>Source</td>
        <td>Destination</td>
        <td>Description</td>
        <td>Severity</td>
      </tr>
    </thead>
    <tbody>
      {#each logStashes as logStash}
        <tr>
          <td>{formatDateTime(logStash.timestamp * 1000)}</td>
          <td>{logStash.src_ip}</td>
          <td>{logStash.dst_ip}</td>
          <td>{logStash.info}</td>
          <td>{logStash.severity}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
