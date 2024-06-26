<script lang="ts">
  import { PUBLIC_BUCKET_URL } from "$env/static/public";
  import { browser } from "$app/environment";
  import { getAuthTokenClient } from "$lib/auth";
  import { deleteAvatar, editProfile, uploadAvatar } from "$lib/graphql/user/user";
  import { faMultiply } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  export let bio = '';
  export let pronouns = '';
  export let show = false;
  export let avatarUrl = '';

  let files: FileList;

  $: editingBio = bio;
  $: editingPronouns = pronouns;

  let disabled = false;

  if (browser) {
    onMount(() => {
    })
  }
  
  function closeModal() {
    show = false;
  }

  function removeAvatar() {
    disabled = true;
    deleteAvatar(getAuthTokenClient())
      .then(() => {
        avatarUrl = '';
      })
      .finally(() => {
        disabled = false;
      });
  }

  function handleSubmit() {
    disabled = true;
    
    editProfile(editingBio, editingPronouns, getAuthTokenClient())
      .then(() => {
        bio = editingBio;
        pronouns = editingPronouns;
      })
      .then(() => {
        if (files && files.length > 0) {
          uploadAvatar(files[0], getAuthTokenClient())
            .then((resp) => {
              return resp.json()
            })
            .then((data) => {
              console.log("Avatar uploaded");
              avatarUrl = `${PUBLIC_BUCKET_URL}/${data.hash}`;
              console.log(data);
            })
            .finally(() => {
              disabled = false;
            });
        }
      })
      .finally(() => {
        disabled = false;
      });
    console.log('Bio:', bio);
    console.log('Pronouns:', pronouns);
    closeModal();
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center transition">
    <button transition:fade={{ duration: 150 }} on:click={() => show = false} class="cursor-default absolute inset-0 bg-black opacity-50"></button>
    <div transition:fly={{ delay: 0, duration: 200, x: 0, y: 500, easing: quintOut }} class="relative bg-white dark:bg-neutral-800 rounded-lg p-8 max-w-md">
      <button class="absolute top-0 right-0 p-2 hover:text-neutral-600 transition" on:click={closeModal}>
        <Fa size={"lg"} icon={faMultiply} />
      </button>
      <h2 class="text-xl mb-4 font-semibold">Edit Profile</h2>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          {#if avatarUrl}
            <button class="btn-secondary py-1 px-2 invertColors" on:click={removeAvatar} disabled={disabled}>Remove</button>
          {/if}
          <img src={avatarUrl} alt="Avatar" class="w-12 h-12 rounded-full"/>
          <input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
        </div>

        <span class="border-b border-neutral-200 dark:border-neutral-700"></span>

        <div>
          <label for="bio" class="block mb-1">Bio:</label>
          <input type="text" id="bio" bind:value={editingBio} class="bg-neutral-100 dark:bg-black w-full px-3 py-2 rounded" disabled={disabled}/>
        </div>
        <div>
          <label for="pronouns" class="block mb-1">Pronouns:</label>
          <input type="text" id="pronouns" bind:value={editingPronouns} class="bg-neutral-100 dark:bg-black w-full px-3 py-2 rounded" disabled={disabled}/>
        </div>
        <div class="flex justify-end invertColors gap-5">
          <button class="btn-secondary py-1 px-2" on:click={closeModal} disabled={disabled}>Cancel</button>
          <button class="btn-success py-1 px-2" on:click={handleSubmit} disabled={disabled}>Submit</button>
        </div>
      </div>
    </div>
  </div>
{/if}
