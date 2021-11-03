using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;
using TMPro;

public class PlayerController : MonoBehaviour
{
    [SerializeField] private float speed = 0;
    private int score;
    private Rigidbody rb;
    private float movementX;
    private float movementY;
    [SerializeField] private TextMeshProUGUI countText;
    [SerializeField] private GameObject winTextObject;
    [SerializeField] private int jumpForce = 10;
    [SerializeField] private int gravityScale;
    private int remainingJumps;
    private const int MAX_JUMPS = 1;

    [SerializeField] private AudioSource jumpSound;
    [SerializeField] private AudioSource hitGroundSound;
    [SerializeField] private AudioSource pickupSound;
    // Start is called before the first frame update

    void Awake() 
    {
        remainingJumps = MAX_JUMPS;
    }

    void Start()
    {   
        score = 0;
        rb = GetComponent<Rigidbody>();
        SetCountText();
        winTextObject.SetActive(false);
    }

    void SetCountText()
    {
        countText.text = "Count: " + score.ToString();
        if (score == 14) {
            winTextObject.SetActive(true);
        }

        if (!gameObject.activeInHierarchy)
        {
            TextMeshProUGUI win = winTextObject.GetComponent<TextMeshProUGUI>();
            win.text = "YOU LOSE\nGAME OVER!";
            winTextObject.SetActive(true);
        }
    }

    void OnJump()
    {
        if (remainingJumps > 0) 
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            --remainingJumps;
            jumpSound.Play();
        }
    }

    void OnMove(InputValue movementValue)
    {
        Vector2 movementVector = movementValue.Get<Vector2>();
        movementX = movementVector.x;
        movementY = movementVector.y;
    }
    
    void FixedUpdate()
    {
        rb.AddForce(Physics.gravity * gravityScale * rb.mass);
        Vector3 movement = new Vector3(movementX, 0.0f, movementY);
        rb.AddForce(movement * speed);
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.CompareTag("PickUp"))
        {
            other.gameObject.SetActive(false);
            score = score + 1;
            pickupSound.Play();
            SetCountText();
        }
        else if (other.gameObject.CompareTag("DeadZone"))
        {
            gameObject.SetActive(false);
            SetCountText();
        }
    }

    private void OnCollisionEnter(Collision objectCollision)
    {
        Debug.Log("HIT SURFACE");
        remainingJumps = MAX_JUMPS;
        hitGroundSound.Play();
    }
}
